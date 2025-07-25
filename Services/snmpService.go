package services

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	models "net_monitor/Models"
	"net_monitor/websocket"
)

type SNMPService struct {
	hub             *websocket.Hub
	roteadorService RoteadorService
	collectors      map[string]websocket.SNMPCollector
	activeChannels  map[string]*CollectionChannel
	mu              sync.RWMutex
}

type CollectionChannel struct {
	RouterID  string
	Router    models.Roteador
	Collector websocket.SNMPCollector
	StopCh    chan struct{}
	IsRunning bool
	Interval  time.Duration
}

func NewSNMPService(hub *websocket.Hub, roteadorService RoteadorService) *SNMPService {
	return &SNMPService{
		hub:             hub,
		roteadorService: roteadorService,
		collectors:      make(map[string]websocket.SNMPCollector),
		activeChannels:  make(map[string]*CollectionChannel),
	}
}

func (s *SNMPService) RegisterCollector(collector websocket.SNMPCollector) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.collectors[collector.GetVendor()] = collector
	s.hub.RegisterCollector(collector)
}

func (s *SNMPService) StartCollection(routerID string, interval time.Duration) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if channel, exists := s.activeChannels[routerID]; exists && channel.IsRunning {
		log.Printf("Canal já ativo para roteador %s", routerID)
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

	channel := &CollectionChannel{
		RouterID:  routerID,
		Router:    *router,
		Collector: collector,
		StopCh:    make(chan struct{}),
		IsRunning: true,
		Interval:  interval,
	}

	s.activeChannels[routerID] = channel

	go s.collectData(channel)

	log.Printf("Coleta iniciada para roteador %s (%s)", router.Nome, router.Integracao)
	return nil
}

func (s *SNMPService) StopCollection(routerID string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if channel, exists := s.activeChannels[routerID]; exists && channel.IsRunning {
		close(channel.StopCh)
		channel.IsRunning = false
		delete(s.activeChannels, routerID)
		log.Printf("Coleta interrompida para roteador %s", routerID)
	}
}

func (s *SNMPService) collectData(channel *CollectionChannel) {
	ticker := time.NewTicker(channel.Interval)
	defer ticker.Stop()

	for {
		select {
		case <-channel.StopCh:
			return

		case <-ticker.C:
			data, err := channel.Collector.Collect(channel.Router)

			message := websocket.SNMPMessage{
				RouterID:   channel.RouterID,
				RouterName: channel.Router.Nome,
				Vendor:     string(channel.Router.Integracao),
				Data:       data,
				Timestamp:  time.Now(),
			}

			if err != nil {
				message.Error = err.Error()
				log.Printf("Erro na coleta SNMP para %s: %v", channel.Router.Nome, err)
			}

			jsonData, err := json.Marshal(message)
			if err != nil {
				log.Printf("Erro ao serializar dados: %v", err)
				continue
			}

			s.hub.Broadcast(jsonData)
		}
	}
}
