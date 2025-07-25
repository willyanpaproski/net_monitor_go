package mikrotiksnmpcollectors

import (
	models "net_monitor/Models"
	snmp "net_monitor/SNMP"

	"github.com/gosnmp/gosnmp"
)

func CollectMikrotikCpuUtilizationPercent(goSnmp *gosnmp.GoSNMP, router models.Roteador) (int, error) {
	result, err := snmp.GetIntOid(goSnmp, "1.3.6.1.2.1.25.3.3.1.2.1", "cpuUtilizationPercent", router)
	if err != nil {
		return 0, err
	}

	return result, nil
}
