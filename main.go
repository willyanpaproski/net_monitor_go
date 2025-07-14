package main

import (
	"fmt"
	"log"
	controllers "net_monitor/Controllers"
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	routes "net_monitor/Routes"
	"net_monitor/Seeders"
	services "net_monitor/Services"
	"net_monitor/db"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env %v", err)
	}

	db.InitDatabase()

	roteadorCollection := db.GetCollection("roteador")
	roteadorRepo := repository.NewMongoRepository[models.Roteador](roteadorCollection)
	roteadorService := services.NewRoteadorService(roteadorRepo)
	roteadorController := controllers.NewRoteadorController(roteadorService)

	transmissorFibraCollection := db.GetCollection("transmissorFibra")
	transmissorFibraRepo := repository.NewMongoRepository[models.TransmissorFibra](transmissorFibraCollection)
	transmissorFibraService := services.NewTransmissorFibraService(transmissorFibraRepo)
	transmissorFibraController := controllers.NewTransmissorFibraController(transmissorFibraService)

	switchRedeCollection := db.GetCollection("switchRede")
	switchRedeRepo := repository.NewMongoRepository[models.SwitchRede](switchRedeCollection)
	switchRedeService := services.NewSwitchRedeService(switchRedeRepo)
	switchRedeController := controllers.NewSwitchRedeController(switchRedeService)

	if os.Getenv("SEEDER_ACTIVATED") == "1" {
		//Seeders.RoteadorSeeder(roteadorRepo, roteadorService)
		//Seeders.TransmissorFibraSeeder(transmissorFibraRepo, transmissorFibraService)
		Seeders.SwitchRedeSeeder(switchRedeRepo, switchRedeService)
	}

	router := gin.Default()

	routes.SetupRoteadorRoutes(router, roteadorController)
	routes.SetupTransmissorFibraRoutes(router, transmissorFibraController)
	routes.StartupSwitchRedeRoutes(router, switchRedeController)

	if err := router.Run(":" + os.Getenv("APP_PORT")); err != nil {
		log.Fatalf("Erro ao iniciar servidor %v", err)
	}

	fmt.Println("Go net monitor started")
}
