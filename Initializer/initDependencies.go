package initializer

import (
	controllers "net_monitor/Controllers"
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	routes "net_monitor/Routes"
	services "net_monitor/Services"
	"net_monitor/db"

	"github.com/gin-gonic/gin"
)

func InitDependencies(router *gin.Engine) {
	roteadorCollection := db.GetCollection("roteador")
	roteadorRepo := repository.NewMongoRepository[models.Roteador](roteadorCollection)
	roteadorService := services.NewRoteadorService(roteadorRepo)
	roteadorController := controllers.NewRoteadorController(roteadorService)
	routes.SetupRoteadorRoutes(router, roteadorController)

	transmissorFibraCollection := db.GetCollection("transmissorFibra")
	transmissorFibraRepo := repository.NewMongoRepository[models.TransmissorFibra](transmissorFibraCollection)
	transmissorFibraService := services.NewTransmissorFibraService(transmissorFibraRepo)
	transmissorFibraController := controllers.NewTransmissorFibraController(transmissorFibraService)
	routes.SetupTransmissorFibraRoutes(router, transmissorFibraController)

	switchRedeCollection := db.GetCollection("switchRede")
	switchRedeRepo := repository.NewMongoRepository[models.SwitchRede](switchRedeCollection)
	switchRedeService := services.NewSwitchRedeService(switchRedeRepo)
	switchRedeController := controllers.NewSwitchRedeController(switchRedeService)
	routes.StartupSwitchRedeRoutes(router, switchRedeController)
}
