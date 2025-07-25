package mikrotik

import (
	"log"
	"time"

	models "net_monitor/Models"
	mikrotiksnmpcollectors "net_monitor/SNMP/Mikrotik/MikrotikSnmpCollectors"
	"net_monitor/Utils"

	"github.com/gosnmp/gosnmp"
)

type MikrotikCollector struct{}

func NewMikrotikCollector() *MikrotikCollector {
	return &MikrotikCollector{}
}

func (m *MikrotikCollector) GetVendor() string {
	return "mikrotik"
}

func (m *MikrotikCollector) Collect(roteador models.Roteador) (map[string]interface{}, error) {
	snmpPort, err := Utils.ParseInt(roteador.PortaSnmp)
	if err != nil {
		return nil, err
	}

	params := &gosnmp.GoSNMP{
		Target:    roteador.EnderecoIP,
		Port:      uint16(snmpPort),
		Community: roteador.CommunitySnmp,
		Version:   gosnmp.Version2c,
		Timeout:   2 * time.Second,
		Retries:   1,
	}

	err = params.Connect()
	if err != nil {
		return nil, err
	}
	defer params.Conn.Close()

	data := make(map[string]interface{})

	if usedMemory, err := mikrotiksnmpcollectors.CollectMikrotikUsedMemory(params, roteador); err == nil {
		data["used_memory_mb"] = usedMemory
	} else {
		log.Printf("Erro ao coletar memória do roteador %s: %v", roteador.Nome, err)
		data["used_memory_mb"] = nil
	}

	if cpuUsage, err := mikrotiksnmpcollectors.CollectMikrotikCpuUtilizationPercent(params, roteador); err == nil {
		data["cpu_usage_percent"] = cpuUsage
	} else {
		log.Printf("Erro ao coletar CPU do roteador %s: %v", roteador.Nome, err)
		data["cpu_usage_percent"] = nil
	}

	return data, nil
}
