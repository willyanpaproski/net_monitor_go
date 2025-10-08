package netflow

import (
	"log"
	models "net_monitor/Models"
)

type MikrotikMetricService struct{}

func NewMikrotikMetricService() *MikrotikMetricService {
	return &MikrotikMetricService{}
}

func (m *MikrotikMetricService) Process(router *models.Roteador, decoded *DecodedIPFIXMessage) error {
	if router != nil {
		log.Printf("[MikrotikMetricService] Processando IPFIX do roteador %s (%s). Seq=%d ObsDomain=%d FlowRecords=%d",
			router.Name, router.IPAddress, decoded.Header.SequenceNumber, decoded.Header.ObservationDomain, len(decoded.FlowRecords))
	} else {
		log.Printf("[MikrotikMetricService] Processando IPFIX de roteador desconhecido. ObsDomain=%d FlowRecords=%d",
			decoded.Header.ObservationDomain, len(decoded.FlowRecords))
	}

	// for idx, record := range decoded.FlowRecords {
	// 	log.Printf("[MikrotikMetricService] Flow %d:", idx)

	// 	if record.SourceIPv4Address != "" || record.SourceIPv6Address != "" {
	// 		srcIP := record.SourceIPv4Address
	// 		if srcIP == "" {
	// 			srcIP = record.SourceIPv6Address
	// 		}
	// 		dstIP := record.DestinationIPv4Address
	// 		if dstIP == "" {
	// 			dstIP = record.DestinationIPv6Address
	// 		}

	// 		log.Printf("  Src: %s:%d -> Dst: %s:%d",
	// 			srcIP, record.SourceTransportPort,
	// 			dstIP, record.DestinationTransportPort)
	// 	}

	// 	log.Printf("  Protocol: %d, Bytes: %d, Packets: %d",
	// 		record.ProtocolIdentifier, record.OctetDeltaCount, record.PacketDeltaCount)

	// 	if record.IngressInterface > 0 || record.EgressInterface > 0 {
	// 		log.Printf("  Interfaces - Ingress: %d, Egress: %d",
	// 			record.IngressInterface, record.EgressInterface)
	// 	}

	// 	if record.FlowStartMilliseconds > 0 || record.FlowEndMilliseconds > 0 {
	// 		log.Printf("  Duration - Start: %d, End: %d",
	// 			record.FlowStartMilliseconds, record.FlowEndMilliseconds)
	// 	}

	// 	// Aqui você pode implementar a lógica de geração de métricas
	// 	// Exemplos de implementações possíveis:

	// 	// 1. Salvar no banco de dados
	// 	// err := m.saveFlowToDatabase(router, record)

	// 	// 2. Gerar agregações por IP/Porta/Protocolo
	// 	// m.aggregateByProtocol(record.ProtocolIdentifier, record.OctetDeltaCount)

	// 	// 3. Calcular bandwidth em tempo real
	// 	// if record.FlowEndMilliseconds > record.FlowStartMilliseconds {
	// 	//     duration := record.FlowEndMilliseconds - record.FlowStartMilliseconds
	// 	//     bandwidth := (record.OctetDeltaCount * 8 * 1000) / duration // bits per second
	// 	//     log.Printf("  Bandwidth: %d bps", bandwidth)
	// 	// }

	// 	// 4. Detectar anomalias
	// 	// if record.OctetDeltaCount > THRESHOLD {
	// 	//     m.alertHighBandwidth(router, record)
	// 	// }

	// 	// 5. Enviar para sistema de monitoramento (Prometheus, Grafana, etc)
	// 	// m.sendToPrometheus(router, record)

	// 	// 6. Análise de tráfego por aplicação
	// 	// app := m.identifyApplication(record.DestinationTransportPort, record.ProtocolIdentifier)
	// 	// log.Printf("  Application: %s", app)
	// }

	return nil
}

// Exemplo de método para salvar no banco de dados
// func (m *MikrotikMetricService) saveFlowToDatabase(router *models.Roteador, record FlowRecord) error {
//     flowMetric := models.FlowMetric{
//         RouterID:    router.ID,
//         SourceIP:    record.SourceIPv4Address,
//         DestIP:      record.DestinationIPv4Address,
//         SrcPort:     record.SourceTransportPort,
//         DstPort:     record.DestinationTransportPort,
//         Protocol:    record.ProtocolIdentifier,
//         Bytes:       record.OctetDeltaCount,
//         Packets:     record.PacketDeltaCount,
//         Timestamp:   time.Now(),
//     }
//     return m.repo.Insert(flowMetric)
// }

// Exemplo de método para identificar aplicação pela porta
// func (m *MikrotikMetricService) identifyApplication(port uint16, protocol uint8) string {
//     if protocol == 6 { // TCP
//         switch port {
//         case 80, 8080:
//             return "HTTP"
//         case 443:
//             return "HTTPS"
//         case 22:
//             return "SSH"
//         case 3389:
//             return "RDP"
//         case 21:
//             return "FTP"
//         }
//     } else if protocol == 17 { // UDP
//         switch port {
//         case 53:
//             return "DNS"
//         case 123:
//             return "NTP"
//         case 161, 162:
//             return "SNMP"
//         }
//     }
//     return "Unknown"
// }
