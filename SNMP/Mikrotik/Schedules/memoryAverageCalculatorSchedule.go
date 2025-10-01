package mikrotikScheduler

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	"net_monitor/Utils"
	interfaces "net_monitor/interfaces"

	"go.mongodb.org/mongo-driver/bson"
)

var _ interfaces.Scheduler = (*MemoryScheduler)(nil)

type AverageMemoryScheduler struct {
	RouterRepo *repository.MongoRepository[models.Roteador]
	StopCh     chan struct{}
}

func NewAverageMemoryCalculatorScheduler(
	routerRepo *repository.MongoRepository[models.Roteador],
) *AverageMemoryScheduler {
	return &AverageMemoryScheduler{
		RouterRepo: routerRepo,
		StopCh:     make(chan struct{}),
	}
}

func (s *AverageMemoryScheduler) Start() {
	s.calculateAllAverageMemoryUsage()

	timer := Utils.GetNextMidnight()

	for {
		select {
		case <-timer.C:
			s.calculateAllAverageMemoryUsage()
		case <-s.StopCh:
			return
		}
	}
}

func (s *AverageMemoryScheduler) Stop() {
	close(s.StopCh)
}

func (s *AverageMemoryScheduler) calculateAllAverageMemoryUsage() {
	routers, err := s.RouterRepo.GetByFilter(bson.M{
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
		go s.calculateAverageMemoryUsage(router)
	}
}

func (s *AverageMemoryScheduler) calculateAverageMemoryUsage(router models.Roteador) float64 {
	if router.MemoryUsageToday == nil {
		router.MemoryUsageToday = []models.MemoryRecord{}
		s.RouterRepo.Update(router.ID.Hex(), &router)
		return 0
	}
	if len(router.MemoryUsageToday) == 0 {
		return 0
	}
	totalMemory := 0.0
	for _, memoryRegister := range router.MemoryUsageToday {
		totalMemory += memoryRegister.Value
	}
	router.MemoryUsageToday = []models.MemoryRecord{}
	s.RouterRepo.Update(router.ID.Hex(), &router)
	return totalMemory / float64(len((router.MemoryUsageToday)))
}
