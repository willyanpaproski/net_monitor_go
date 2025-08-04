package routes

import (
	controllers "net_monitor/Controllers"

	"github.com/gin-gonic/gin"
)

func SetupSwitchRedeRoutes(
	router *gin.Engine,
	switchRedeController *controllers.SwitchRedeController,
) {
	api := router.Group("/api")
	{
		switchesRede := api.Group("/switches")
		{
			switchesRede.GET("", switchRedeController.GetAllSwitchesRede)
			switchesRede.GET("/:id", switchRedeController.GetSwitchRedeById)
			switchesRede.POST("", switchRedeController.CreateSwitchRede)
			switchesRede.PATCH("/:id", switchRedeController.UpdateSwitchRede)
			switchesRede.DELETE("/:id", switchRedeController.Delete)
		}
	}
}
