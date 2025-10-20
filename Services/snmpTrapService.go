package services

import (
	"log"
	models "net_monitor/Models"
	trap "net_monitor/SNMP/Trap"
	"net_monitor/websocket"
)

type TrapService struct {
	listener        *trap.TrapListener
	roteadorService RoteadorService
}

func NewTrapService(hub *websocket.Hub, roteadorService RoteadorService, port string) *TrapService {
	listener := trap.NewTrapListener(port, hub)

	return &TrapService{
		listener:        listener,
		roteadorService: roteadorService,
	}
}

func (ts *TrapService) Start() error {
	routers, err := ts.roteadorService.GetAll()
	if err != nil {
		log.Printf("Erro ao carregar roteadores para trap service: %v", err)
	} else {
		for _, router := range routers {
			ts.listener.RegisterRouter(&router)
		}
	}

	return ts.listener.Start()
}

func (ts *TrapService) Stop() {
	ts.listener.Stop()
}

func (ts *TrapService) RegisterRouter(router *models.Roteador) {
	ts.listener.RegisterRouter(router)
}

func (ts *TrapService) UnregisterRouter(routerIP string) {
	ts.listener.UnregisterRouter(routerIP)
}
