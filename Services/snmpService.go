package services

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	models "net_monitor/Models"
	"net_monitor/config"
	"net_monitor/interfaces"
	"net_monitor/websocket"
)

type SNMPService struct {
	hub             *websocket.Hub
	roteadorService RoteadorService
	collectors      map[string]interfaces.SNMPCollector
	activeChannels  map[string]*RouterCollection
	mu              sync.RWMutex
}

type RouterCollection struct {
	RouterID  string
	Router    models.Roteador
	Collector interfaces.SNMPCollector
	Metrics   map[string]*MetricCollection
	IsRunning bool
	StopCh    chan struct{}
}

type MetricCollection struct {
	Name       string
	Config     config.MetricConfig
	LastValue  interface{}
	LastUpdate time.Time
	Ticker     *time.Ticker
	CollectFn  func() (interface{}, error)
}

type SNMPMetricMessage struct {
	RouterID   string      `json:"router_id"`
	RouterName string      `json:"router_name"`
	Vendor     string      `json:"vendor"`
	Metric     string      `json:"metric"`
	Value      interface{} `json:"value"`
	Timestamp  time.Time   `json:"timestamp"`
	Error      string      `json:"error,omitempty"`
}

func NewSNMPService(hub *websocket.Hub, roteadorService RoteadorService) *SNMPService {
	return &SNMPService{
		hub:             hub,
		roteadorService: roteadorService,
		collectors:      make(map[string]interfaces.SNMPCollector),
		activeChannels:  make(map[string]*RouterCollection),
	}
}

func (s *SNMPService) RegisterCollector(collector interfaces.SNMPCollector) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.collectors[collector.GetVendor()] = collector
	s.hub.RegisterCollector(collector)
}

func (s *SNMPService) getMetricConfigs(vendor string) []config.MetricConfig {
	if configs, exists := config.VendorMetricMappings[vendor]; exists {
		return configs
	}

	log.Printf("Vendor %s não encontrado, usando configuração padrão", vendor)
	return config.DefaultMetricMappings
}

func (s *SNMPService) StartCollectionWithConfig(routerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if collection, exists := s.activeChannels[routerID]; exists && collection.IsRunning {
		log.Printf("Coleta já ativa para roteador %s", routerID)
		return nil
	}

	router, err := s.roteadorService.GetById(routerID)
	if err != nil {
		return err
	}

	collector, exists := s.collectors[string(router.Integracao)]
	if !exists {
		log.Printf("Collector não encontrado para vendor: %s", router.Integracao)
		return nil
	}

	configs := s.getMetricConfigs(string(router.Integracao))

	collection := &RouterCollection{
		RouterID:  routerID,
		Router:    *router,
		Collector: collector,
		Metrics:   make(map[string]*MetricCollection),
		IsRunning: true,
		StopCh:    make(chan struct{}),
	}

	for _, config := range configs {
		metric := &MetricCollection{
			Name:   config.Name,
			Config: config,
		}

		metric.CollectFn = s.createGenericCollectFunction(collector, *router, config)
		collection.Metrics[config.Name] = metric
	}

	s.activeChannels[routerID] = collection

	go s.startMetricCollections(collection)

	log.Printf("Coleta multi-intervalo iniciada para roteador %s (%s) com %d métricas",
		router.Nome, router.Integracao, len(configs))

	return nil
}

func (s *SNMPService) StartCollection(routerID string) error {
	return s.StartCollectionWithConfig(routerID)
}

func (s *SNMPService) StopCollection(routerID string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if collection, exists := s.activeChannels[routerID]; exists && collection.IsRunning {
		close(collection.StopCh)
		collection.IsRunning = false

		for _, metric := range collection.Metrics {
			if metric.Ticker != nil {
				metric.Ticker.Stop()
			}
		}

		delete(s.activeChannels, routerID)
		log.Printf("Coleta multi-intervalo interrompida para roteador %s", routerID)
	}
}

func (s *SNMPService) createGenericCollectFunction(
	collector interfaces.SNMPCollector,
	router models.Roteador,
	metricConfig config.MetricConfig,
) func() (interface{}, error) {

	return func() (interface{}, error) {
		if extendedCollector, ok := collector.(interfaces.ExtendedSNMPCollector); ok {
			value, err := extendedCollector.CollectMetric(router, metricConfig.Name)
			if err == nil && value != nil {
				return value, nil
			}
			log.Printf("Collector estendido falhou para %s, tentando fallback: %v", metricConfig.Name, err)
		}

		data, err := collector.Collect(router)
		if err != nil {
			return nil, err
		}

		if value, exists := data[metricConfig.DataKey]; exists && value != nil {
			return value, nil
		}

		for _, fallbackKey := range metricConfig.FallbackKeys {
			if value, exists := data[fallbackKey]; exists && value != nil {
				log.Printf("Usando chave de fallback '%s' para métrica '%s'", fallbackKey, metricConfig.Name)
				return value, nil
			}
		}

		if metricConfig.Required {
			return nil, fmt.Errorf("métrica obrigatória '%s' não encontrada (tentativas: %s, %v)",
				metricConfig.Name, metricConfig.DataKey, metricConfig.FallbackKeys)
		}

		log.Printf("Métrica opcional '%s' não encontrada para %s", metricConfig.Name, router.Nome)
		return nil, nil
	}
}

func (s *SNMPService) startMetricCollections(collection *RouterCollection) {
	var wg sync.WaitGroup

	for metricName, metric := range collection.Metrics {
		wg.Add(1)
		go func(name string, m *MetricCollection) {
			defer wg.Done()
			s.collectMetricData(collection, name, m)
		}(metricName, metric)
	}

	wg.Wait()
}

func (s *SNMPService) collectMetricData(collection *RouterCollection, metricName string, metric *MetricCollection) {
	s.performMetricCollection(collection, metricName, metric)

	metric.Ticker = time.NewTicker(metric.Config.Interval)
	defer metric.Ticker.Stop()

	for {
		select {
		case <-collection.StopCh:
			return

		case <-metric.Ticker.C:
			s.performMetricCollection(collection, metricName, metric)
		}
	}
}

func (s *SNMPService) performMetricCollection(collection *RouterCollection, metricName string, metric *MetricCollection) {
	value, err := metric.CollectFn()

	message := SNMPMetricMessage{
		RouterID:   collection.RouterID,
		RouterName: collection.Router.Nome,
		Vendor:     string(collection.Router.Integracao),
		Metric:     metricName,
		Value:      value,
		Timestamp:  time.Now(),
	}

	if err != nil {
		message.Error = err.Error()
		log.Printf("Erro na coleta da métrica %s para %s: %v", metricName, collection.Router.Nome, err)
	} else if value != nil {
		metric.LastValue = value
		metric.LastUpdate = message.Timestamp
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		log.Printf("Erro ao serializar métrica %s: %v", metricName, err)
		return
	}

	s.hub.Broadcast(jsonData)
}
