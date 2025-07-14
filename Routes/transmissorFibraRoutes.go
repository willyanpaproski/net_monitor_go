package routes

import (
	controllers "net_monitor/Controllers"

	"github.com/gin-gonic/gin"
)

func SetupTransmissorFibraRoutes(
	router *gin.Engine,
	transmissorFibraController *controllers.TransmissorFibraController,
) {
	api := router.Group("/api")
	{
		transmissoresFibra := api.Group("/transmissoresFibra")
		{
			transmissoresFibra.GET("", transmissorFibraController.GetAllTransmissoresFibra)
			transmissoresFibra.GET("/:id", transmissorFibraController.GetTransmissorFibraById)
			transmissoresFibra.POST("", transmissorFibraController.CreateTransmissorFibra)
			transmissoresFibra.PATCH("/:id", transmissorFibraController.UpdateTransmissorFibra)
			transmissoresFibra.DELETE("/:id", transmissorFibraController.DeleteTransmissorFibra)
		}
	}
}
