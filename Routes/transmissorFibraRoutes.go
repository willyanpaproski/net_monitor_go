package routes

import (
	controllers "net_monitor/Controllers"
	middlewares "net_monitor/Middlewares"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

func SetupTransmissorFibraRoutes(
	router *gin.Engine,
	transmissorFibraController *controllers.TransmissorFibraController,
	authService services.AuthService,
) {
	api := router.Group("/api")
	{
		transmissoresFibra := api.Group("/transmitters")
		transmissoresFibra.Use(middlewares.AuthMiddleware(authService))
		{
			transmissoresFibra.GET("", transmissorFibraController.GetAllTransmissoresFibra)
			transmissoresFibra.GET("/:id", transmissorFibraController.GetTransmissorFibraById)
			transmissoresFibra.POST("", transmissorFibraController.CreateTransmissorFibra)
			transmissoresFibra.PATCH("/:id", transmissorFibraController.UpdateTransmissorFibra)
			transmissoresFibra.DELETE("/:id", transmissorFibraController.DeleteTransmissorFibra)
		}
	}
}
