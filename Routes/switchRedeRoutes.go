package routes

import (
	controllers "net_monitor/Controllers"
	middlewares "net_monitor/Middlewares"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

func SetupSwitchRedeRoutes(
	router *gin.Engine,
	switchRedeController *controllers.SwitchRedeController,
	authService services.AuthService,
) {
	api := router.Group("/api")
	{
		switchesRede := api.Group("/switches")
		switchesRede.Use(middlewares.AuthMiddleware(authService))
		{
			switchesRede.GET("", switchRedeController.GetAllSwitchesRede)
			switchesRede.GET("/:id", switchRedeController.GetSwitchRedeById)
			switchesRede.POST("", switchRedeController.CreateSwitchRede)
			switchesRede.PATCH("/:id", switchRedeController.UpdateSwitchRede)
			switchesRede.DELETE("/:id", switchRedeController.Delete)
		}
	}
}
