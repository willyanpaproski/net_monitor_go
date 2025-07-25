package mikrotiksnmpcollectors

import (
	models "net_monitor/Models"
	snmp "net_monitor/SNMP"
	"net_monitor/Utils"

	"github.com/gosnmp/gosnmp"
)

func CollectMikrotikUsedMemory(goSnmp *gosnmp.GoSNMP, router models.Roteador) (float64, error) {
	result, err := snmp.GetIntOid(goSnmp, "1.3.6.1.2.1.25.2.3.1.6.65536", "usedMemory", router)
	if err != nil {
		return 0, err
	}

	usedMemoryMB := float64(result) / 1024.0
	return Utils.ChangeFloatPrecision(usedMemoryMB, 1), nil
}
