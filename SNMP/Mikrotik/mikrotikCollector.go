package mikrotik

import (
	"log"
	models "net_monitor/Models"
	"net_monitor/Utils"
	"time"

	"github.com/gosnmp/gosnmp"
)

type MikrotikCollector struct{}

func (m *MikrotikCollector) MikrotikSNMP(roteador models.Roteador) (map[string]interface{}, error) {
	snmpPort, snmpPortError := Utils.ParseInt(roteador.PortaSnmp)
	if snmpPortError != nil {
		log.Fatalf("Error casting SNMP Port %v", snmpPortError)
	}

	params := &gosnmp.GoSNMP{
		Target:    roteador.EnderecoIP,
		Port:      uint16(snmpPort),
		Community: roteador.CommunitySnmp,
		Version:   gosnmp.Version2c,
		Timeout:   2 * time.Second,
		Retries:   1,
	}

	snmpConnectionError := params.Connect()
	if snmpConnectionError != nil {
		log.Fatalf("Error connecting with snmp device %v:%v\n%v", roteador.Nome, roteador.EnderecoIP, snmpConnectionError)
	}
	defer params.Conn.Close()

	oids := []string{".1.3.6.1.2.1.1.1.0"}
	result, err := params.Get(oids)
	if err != nil {
		return nil, err
	}

	data := make(map[string]interface{})
	for _, variable := range result.Variables {
		data["sysDescr"] = string(variable.Value.([]byte))
	}
	return data, nil
}
