package netflow

import (
	models "net_monitor/Models"
	"sync"
)

type MetricService interface {
	Process(router *models.Roteador, decoded *DecodedIPFIXMessage) error
}

var (
	serviceRegistry = map[string]MetricService{}
	regMu           = sync.RWMutex{}
)

func RegisterMetricService(integration string, svc MetricService) {
	regMu.Lock()
	defer regMu.Unlock()
	serviceRegistry[integration] = svc
}

func GetMetricService(integration string) (MetricService, bool) {
	regMu.RLock()
	defer regMu.RUnlock()
	s, ok := serviceRegistry[integration]
	return s, ok
}
