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
			roteadores.GET("", roteadorController.GetAll)
			roteadores.GET("/:id", roteadorController.GetById)
			roteadores.POST("", roteadorController.Create)
			roteadores.PATCH("/:id", roteadorController.Update)
			roteadores.DELETE("/:id", roteadorController.Delete)
		}
	}
}
