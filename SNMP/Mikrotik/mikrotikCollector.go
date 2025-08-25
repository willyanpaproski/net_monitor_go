package mikrotik

import (
	"fmt"
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
	snmpParams, err := m.createSNMPParams(roteador)
	if err != nil {
		return nil, err
	}
	defer snmpParams.Conn.Close()

	data := make(map[string]interface{})

	if cpu, err := mikrotiksnmpcollectors.CollectMikrotikCpuUtilizationPercent(snmpParams, roteador); err == nil {
		data["cpu_usage_percent"] = cpu
	}

	if memory, err := mikrotiksnmpcollectors.CollectMikrotikUsedMemory(snmpParams, roteador); err == nil {
		data["used_memory_mb"] = memory
	}

	return data, nil
}

func (m *MikrotikCollector) CollectMetric(router models.Roteador, metricName string) (interface{}, error) {
	snmpParams, err := m.createSNMPParams(router)
	if err != nil {
		return nil, err
	}
	defer snmpParams.Conn.Close()

	switch metricName {
	case "cpu_usage":
		return mikrotiksnmpcollectors.CollectMikrotikCpuUtilizationPercent(snmpParams, router)
	case "memory_usage":
		return mikrotiksnmpcollectors.CollectMikrotikUsedMemory(snmpParams, router)
	default:
		return nil, fmt.Errorf("métrica '%s' não suportada pelo collector MikroTik", metricName)
	}
}

func (m *MikrotikCollector) GetSupportedMetrics() []string {
	return []string{"cpu_usage", "memory_usage", "interface_stats", "system_info"}
}

func (m *MikrotikCollector) GetMetricMapping() map[string]string {
	return map[string]string{
		"cpu_usage":    "cpu_usage_percent",
		"memory_usage": "used_memory_mb",
	}
}

func (m *MikrotikCollector) createSNMPParams(router models.Roteador) (*gosnmp.GoSNMP, error) {
	snmpPort, err := Utils.ParseInt(router.PortaSnmp)
	if err != nil {
		return nil, err
	}

	params := &gosnmp.GoSNMP{
		Target:    router.EnderecoIP,
		Port:      uint16(snmpPort),
		Community: router.CommunitySnmp,
		Version:   gosnmp.Version2c,
		Timeout:   2 * time.Second,
		Retries:   1,
	}

	err = params.Connect()
	if err != nil {
		return nil, err
	}

	return params, nil
}
