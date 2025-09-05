package routes

import (
	controllers "net_monitor/Controllers"
	middlewares "net_monitor/Middlewares"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

func SetupLogRoutes(
	router *gin.Engine,
	logController *controllers.LogController,
	authService services.AuthService,
) {
	api := router.Group("/api")
	api.Use(middlewares.AuthMiddleware(authService))
	{
		logs := api.Group("/logs")
		{
			logs.GET("", logController.GetAllLogs)
			logs.GET("/:id", logController.GetLogById)
			logs.POST("", logController.CreateLog)
		}
	}
}
