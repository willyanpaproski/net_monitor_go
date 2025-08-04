package routes

import (
	controllers "net_monitor/Controllers"

	"github.com/gin-gonic/gin"
)

func SetupLogRoutes(
	router *gin.Engine,
	logController *controllers.LogController,
) {
	api := router.Group("/api")
	{
		logs := api.Group("/logs")
		{
			logs.GET("", logController.GetAllLogs)
			logs.GET("/:id", logController.GetLogById)
			logs.POST("", logController.CreateLog)
		}
	}
}
