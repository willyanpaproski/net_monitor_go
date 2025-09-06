package snmp

import (
	"fmt"
	models "net_monitor/Models"
	"strconv"

	"github.com/gosnmp/gosnmp"
)

type SNMPCollector interface {
	Collect(roteador models.Roteador) (map[string]interface{}, error)
}

func GetIntOid(snmp *gosnmp.GoSNMP, oid string, resource string, router models.Roteador) (int, error) {
	result, err := snmp.Get([]string{oid})
	if err != nil {
		return 0, err
	}

	if len(result.Variables) != 0 {
		value := result.Variables[0].Value

		switch v := value.(type) {
		case []byte:
			str := string(v)
			num, err := strconv.Atoi(str)
			if err != nil {
				return 0, fmt.Errorf("Error parsing value to int %v", err)
			}
			return num, nil
		case int:
			return v, nil
		default:
			return 0, fmt.Errorf("Invalid type for %v of %v:%v", resource, router.Name, router.IPAddress)
		}
	}

	return 0, fmt.Errorf("Error collecting %v for %v:%v", resource, router.Name, router.IPAddress)
}

func GetStringOid(snmp *gosnmp.GoSNMP, oid string, resource string, router models.Roteador) (string, error) {
	result, err := snmp.Get([]string{oid})
	if err != nil {
		return "", err
	}

	if len(result.Variables) != 0 {
		value := result.Variables[0].Value

		switch v := value.(type) {
		case []byte:
			return string(v), nil
		case string:
			return v, nil
		default:
			return "", fmt.Errorf("Invalid type for %v of %v:%v", resource, router.Name, router.IPAddress)
		}
	}

	return "", fmt.Errorf("Error collecting %v for %v:%v", resource, router.Name, router.IPAddress)
}
