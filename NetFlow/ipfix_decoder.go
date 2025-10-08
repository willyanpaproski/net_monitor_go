package netflow

import (
	"encoding/binary"
	"fmt"
	"net"
)

var ipfixFieldNames = map[uint16]string{
	1:   "octetDeltaCount",
	2:   "packetDeltaCount",
	4:   "protocolIdentifier",
	5:   "ipClassOfService",
	7:   "sourceTransportPort",
	8:   "sourceIPv4Address",
	9:   "sourceIPv4PrefixLength",
	10:  "ingressInterface",
	11:  "destinationTransportPort",
	12:  "destinationIPv4Address",
	13:  "destinationIPv4PrefixLength",
	14:  "egressInterface",
	15:  "ipNextHopIPv4Address",
	16:  "bgpSourceAsNumber",
	17:  "bgpDestinationAsNumber",
	21:  "flowEndSysUpTime",
	22:  "flowStartSysUpTime",
	27:  "sourceIPv6Address",
	28:  "destinationIPv6Address",
	61:  "flowDirection",
	85:  "octetTotalCount",
	86:  "packetTotalCount",
	136: "flowEndReason",
	148: "flowId",
	150: "flowStartSeconds",
	151: "flowEndSeconds",
	152: "flowStartMilliseconds",
	153: "flowEndMilliseconds",
	154: "flowStartMicroseconds",
	155: "flowEndMicroseconds",
}

type TemplateCache struct {
	templates map[uint32]map[uint16]*Template
}

func NewTemplateCache() *TemplateCache {
	return &TemplateCache{
		templates: make(map[uint32]map[uint16]*Template),
	}
}

func (tc *TemplateCache) AddTemplate(obsDomain uint32, template *Template) {
	if tc.templates[obsDomain] == nil {
		tc.templates[obsDomain] = make(map[uint16]*Template)
	}
	tc.templates[obsDomain][template.TemplateID] = template
}

func (tc *TemplateCache) GetTemplate(obsDomain uint32, templateID uint16) *Template {
	if domainTemplates, ok := tc.templates[obsDomain]; ok {
		return domainTemplates[templateID]
	}
	return nil
}

func DecodeIPFIX(msg *IPFIXMessage, cache *TemplateCache) *DecodedIPFIXMessage {
	decoded := &DecodedIPFIXMessage{
		Header:      msg.Header,
		Templates:   []Template{},
		FlowRecords: []FlowRecord{},
	}

	for _, fs := range msg.FlowSets {
		if fs.FlowSetID == 2 {
			templates := parseTemplateFlowSet(fs.Payload)
			for _, tmpl := range templates {
				cache.AddTemplate(msg.Header.ObservationDomain, &tmpl)
				decoded.Templates = append(decoded.Templates, tmpl)
			}
		} else if fs.FlowSetID >= 256 {
			template := cache.GetTemplate(msg.Header.ObservationDomain, fs.FlowSetID)
			if template != nil {
				records := parseDataFlowSet(fs.Payload, template)
				decoded.FlowRecords = append(decoded.FlowRecords, records...)
			}
		}
	}

	return decoded
}

func parseTemplateFlowSet(payload []byte) []Template {
	templates := []Template{}
	offset := 0

	for offset+4 <= len(payload) {
		templateID := binary.BigEndian.Uint16(payload[offset : offset+2])
		fieldCount := binary.BigEndian.Uint16(payload[offset+2 : offset+4])
		offset += 4

		template := Template{
			TemplateID: templateID,
			FieldCount: fieldCount,
			Fields:     []TemplateField{},
		}

		for i := 0; i < int(fieldCount) && offset+4 <= len(payload); i++ {
			fieldID := binary.BigEndian.Uint16(payload[offset : offset+2])
			fieldLength := binary.BigEndian.Uint16(payload[offset+2 : offset+4])
			offset += 4

			field := TemplateField{
				FieldID:     fieldID & 0x7FFF,
				FieldLength: fieldLength,
				FieldName:   getFieldName(fieldID & 0x7FFF),
			}

			if fieldID&0x8000 != 0 && offset+4 <= len(payload) {
				field.EnterpriseNum = binary.BigEndian.Uint32(payload[offset : offset+4])
				offset += 4
			}

			template.Fields = append(template.Fields, field)
		}

		templates = append(templates, template)
	}

	return templates
}

func parseDataFlowSet(payload []byte, template *Template) []FlowRecord {
	records := []FlowRecord{}
	offset := 0

	recordSize := 0
	for _, field := range template.Fields {
		recordSize += int(field.FieldLength)
	}

	if recordSize == 0 {
		return records
	}

	for offset+recordSize <= len(payload) {
		record := FlowRecord{
			TemplateID: template.TemplateID,
			RawFields:  make(map[string]interface{}),
		}

		fieldOffset := offset
		for _, field := range template.Fields {
			fieldData := payload[fieldOffset : fieldOffset+int(field.FieldLength)]
			fieldOffset += int(field.FieldLength)

			decodeField(&record, field.FieldID, field.FieldName, fieldData)
		}

		records = append(records, record)
		offset += recordSize
	}

	return records
}

func decodeField(record *FlowRecord, fieldID uint16, fieldName string, data []byte) {
	switch fieldID {
	case 8:
		if len(data) >= 4 {
			record.SourceIPv4Address = net.IP(data[:4]).String()
		}
	case 12:
		if len(data) >= 4 {
			record.DestinationIPv4Address = net.IP(data[:4]).String()
		}
	case 27:
		if len(data) >= 16 {
			record.SourceIPv6Address = net.IP(data[:16]).String()
		}
	case 28:
		if len(data) >= 16 {
			record.DestinationIPv6Address = net.IP(data[:16]).String()
		}
	case 7:
		if len(data) >= 2 {
			record.SourceTransportPort = binary.BigEndian.Uint16(data)
		}
	case 11:
		if len(data) >= 2 {
			record.DestinationTransportPort = binary.BigEndian.Uint16(data)
		}
	case 4:
		if len(data) >= 1 {
			record.ProtocolIdentifier = data[0]
		}
	case 1:
		record.OctetDeltaCount = readUintN(data)
	case 2:
		record.PacketDeltaCount = readUintN(data)
	case 152:
		record.FlowStartMilliseconds = readUintN(data)
	case 153:
		record.FlowEndMilliseconds = readUintN(data)
	case 10:
		if len(data) >= 4 {
			record.IngressInterface = binary.BigEndian.Uint32(data)
		}
	case 14:
		if len(data) >= 4 {
			record.EgressInterface = binary.BigEndian.Uint32(data)
		}
	case 5:
		if len(data) >= 1 {
			record.IPClassOfService = data[0]
		}
	case 61:
		if len(data) >= 1 {
			record.FlowDirection = data[0]
		}
	default:
		record.RawFields[fieldName] = fmt.Sprintf("%x", data)
	}
}

func readUintN(data []byte) uint64 {
	switch len(data) {
	case 1:
		return uint64(data[0])
	case 2:
		return uint64(binary.BigEndian.Uint16(data))
	case 4:
		return uint64(binary.BigEndian.Uint32(data))
	case 8:
		return binary.BigEndian.Uint64(data)
	default:
		if len(data) <= 8 {
			padded := make([]byte, 8)
			copy(padded[8-len(data):], data)
			return binary.BigEndian.Uint64(padded)
		}
		return 0
	}
}

func getFieldName(fieldID uint16) string {
	if name, ok := ipfixFieldNames[fieldID]; ok {
		return name
	}
	return fmt.Sprintf("field_%d", fieldID)
}
