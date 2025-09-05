package routes

import (
	"net/http"

	middlewares "net_monitor/Middlewares"
	services "net_monitor/Services"
	"net_monitor/websocket"

	"github.com/gin-gonic/gin"
)

func SetupWebSocketRoutes(
	router *gin.Engine,
	hub *websocket.Hub,
	snmpService *services.SNMPService,
	authService services.AuthService,
) {
	router.GET("/ws/snmp", gin.WrapH(http.HandlerFunc(hub.ServeWS)))

	api := router.Group("/api/snmp")
	api.Use(middlewares.AuthMiddleware(authService))
	{
		api.POST("/start/:router_id", func(c *gin.Context) {
			routerID := c.Param("router_id")

			if err := snmpService.StartCollection(routerID); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Coleta iniciada"})
		})

		api.POST("/stop/:router_id", func(c *gin.Context) {
			routerID := c.Param("router_id")
			snmpService.StopCollection(routerID)
			c.JSON(http.StatusOK, gin.H{"message": "Coleta interrompida"})
		})
	}
}
