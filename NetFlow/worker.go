package netflow

import (
	"encoding/json"
	"log"
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func StartMetricWorkers(decodedRabbit *RabbitMQ, routerRepo repository.MongoRepository[models.Roteador], workerCount int) error {
	deliveries, err := decodedRabbit.Consume()
	if err != nil {
		return err
	}

	for i := 0; i < workerCount; i++ {
		go func(workerId int) {
			log.Printf("Metric worker %d iniciado", workerId)
			for d := range deliveries {
				var dm DecodedIPFIXMessage
				if err := json.Unmarshal(d.Body, &dm); err != nil {
					log.Printf("metric worker %d erro unmarshal msg: %v", workerId, err)
					d.Nack(false, false)
					continue
				}

				var roteador *models.Roteador
				routers, err := routerRepo.GetByFilter(bson.M{"ipAddress": dm.SrcIP})
				if err != nil {
					log.Printf("metric worker %d erro buscando roteador: %v", workerId, err)
				}

				if len(routers) > 0 {
					roteador = &routers[0]
					log.Printf("metric worker %d roteador encontrado: %s (%s)", workerId, roteador.Name, roteador.IPAddress)
				} else {
					roteador = nil
					log.Printf("metric worker %d nenhum roteador encontrado para IP %s", workerId, dm.SrcIP)
				}

				var svc MetricService
				var ok bool

				if roteador != nil && roteador.Integration != "" {
					svc, ok = GetMetricService(string(roteador.Integration))
					if !ok {
						log.Printf("metric worker %d MetricService não encontrado para integration '%s', usando default", workerId, roteador.Integration)
						svc, ok = GetMetricService("default")
					}
				} else {
					svc, ok = GetMetricService("default")
				}

				if ok && svc != nil {
					if err := svc.Process(roteador, &dm); err != nil {
						log.Printf("metric worker %d erro processando via service: %v", workerId, err)
						d.Nack(false, true)
						continue
					}
				} else {
					log.Printf("metric worker %d nenhum MetricService disponível, ignorando mensagem", workerId)
				}

				d.Ack(false)
				time.Sleep(1 * time.Millisecond)
			}
		}(i)
	}

	return nil
}
