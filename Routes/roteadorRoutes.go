package routes

import (
	controllers "net_monitor/Controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoteadorRoutes(
	router *gin.Engine,
	roteadorController *controllers.RoteadorController,
) {
	api := router.Group("/api")
	{
		roteadores := api.Group("/roteadores")
		{
			roteadores.GET("", roteadorController.GetAllRoteadores)
			roteadores.GET("/:id", roteadorController.GetRoteadorById)
			roteadores.POST("", roteadorController.CreateRoteador)
			roteadores.PATCH("/:id", roteadorController.UpdateRoteador)
			roteadores.DELETE("/:id", roteadorController.DeleteRoteador)
		}
	}
}
