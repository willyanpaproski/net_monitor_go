package initializer

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	mikrotik "net_monitor/SNMP/Mikrotik"
	mikrotikScheduler "net_monitor/SNMP/Mikrotik/Schedules"
	services "net_monitor/Services"
	"net_monitor/db"
)

func InitSchedules() *services.SchedulerManager {
	schedulerManager := services.NewSchedulerManager()

	routerCollection := db.GetCollection("roteador")
	routerRepo := repository.NewMongoRepository[models.Roteador](routerCollection)

	mikrotikCollector := mikrotik.NewMikrotikCollector()

	mikrotikMemoryScheduler := mikrotikScheduler.NewMemoryScheduler(routerRepo, mikrotikCollector)
	mikrotikAverageMemoryCalculatorScheduler := mikrotikScheduler.NewAverageMemoryCalculatorScheduler(routerRepo)

	mikrotikCpuScheduler := mikrotikScheduler.NewCPUScheduler(routerRepo, mikrotikCollector)
	mikrotikAverageCpuCalculatorScheduler := mikrotikScheduler.NewAverageCpuCalculatorScheduler(routerRepo)

	schedulerManager.Register(mikrotikMemoryScheduler)
	schedulerManager.Register(mikrotikAverageMemoryCalculatorScheduler)
	schedulerManager.Register(mikrotikCpuScheduler)
	schedulerManager.Register(mikrotikAverageCpuCalculatorScheduler)

	return schedulerManager
}
