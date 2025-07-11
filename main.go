package main

import (
	"log"
	controllers "net_monitor/Controllers"
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	routes "net_monitor/Routes"
	services "net_monitor/Services"
	"net_monitor/db"

	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDatabase()

	roteadorCollection := db.GetCollection("roteador")
	roteadorRepo := repository.NewMongoRepository[models.Roteador](roteadorCollection)
	roteadorService := services.NewRoteadorService(roteadorRepo)
	roteadorController := controllers.NewRoteadorController(roteadorService)

	router := gin.Default()

	routes.SetupRoteadorRoutes(router, roteadorController)

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Erro ao iniciar servidor %v", err)
	}
}
