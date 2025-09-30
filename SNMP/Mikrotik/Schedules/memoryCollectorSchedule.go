package mikrotikScheduler

import (
	"log"
	"time"

	models "net_monitor/Models"
	repository "net_monitor/Repository"
	mikrotik "net_monitor/SNMP/Mikrotik"
	"net_monitor/interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var _ interfaces.Scheduler = (*MemoryScheduler)(nil)

type MemoryScheduler struct {
	RoteadorRepo *repository.MongoRepository[models.Roteador]
	Collector    *mikrotik.MikrotikCollector
	StopCh       chan struct{}
}

func NewMemoryScheduler(
	roteadorRepo *repository.MongoRepository[models.Roteador],
	collector *mikrotik.MikrotikCollector,
) *MemoryScheduler {
	log.Println("[MemoryScheduler] Criando novo scheduler")
	return &MemoryScheduler{
		RoteadorRepo: roteadorRepo,
		Collector:    collector,
		StopCh:       make(chan struct{}),
	}
}

func (s *MemoryScheduler) Start() {

	s.collectAllMemoryUsage()

	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.collectAllMemoryUsage()
		case <-s.StopCh:
			return
		}
	}
}

func (s *MemoryScheduler) Stop() {
	close(s.StopCh)
}

func (s *MemoryScheduler) collectAllMemoryUsage() {

	routers, err := s.RoteadorRepo.GetByFilter(bson.M{
		"integration": models.RoteadorMikrotik,
		"active":      true,
	})

	if err != nil {
		return
	}

	if routers == nil || len(routers) == 0 {
		return
	}

	for _, router := range routers {
		go s.collectRouterMemory(router)
	}
}

func (s *MemoryScheduler) collectRouterMemory(router models.Roteador) {

	memoryUsage, err := s.Collector.CollectMetric(router, "memory_usage")
	if err != nil {
		return
	}

	memoryValue, ok := memoryUsage.(float64)
	if !ok {
		return
	}

	now := primitive.NewDateTimeFromTime(time.Now())
	newRecord := models.MemoryRecord{
		Timestamp: now,
		Value:     memoryValue,
	}

	update := bson.M{
		"$push": bson.M{
			"memoryUsageToday": newRecord,
		},
		"$set": bson.M{
			"updated_at": now,
		},
	}

	err = s.RoteadorRepo.UpdateByFilter(
		bson.M{"_id": router.ID},
		update,
	)

	if err != nil {
		return
	}
}
