package routes

import (
	controllers "net_monitor/Controllers"
	middlewares "net_monitor/Middlewares"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

func SetupRoteadorRoutes(
	router *gin.Engine,
	roteadorController *controllers.RoteadorController,
	authService services.AuthService,
) {
	api := router.Group("/api")
	{
		roteadores := api.Group("/routers")
		roteadores.Use(middlewares.AuthMiddleware(authService))
		{
			roteadores.GET("", roteadorController.GetAllRoteadores)
			roteadores.GET("/:id", roteadorController.GetRoteadorById)
			roteadores.POST("", roteadorController.CreateRoteador)
			roteadores.PATCH("/:id", roteadorController.UpdateRoteador)
			roteadores.DELETE("/:id", roteadorController.DeleteRoteador)
		}
	}
}
