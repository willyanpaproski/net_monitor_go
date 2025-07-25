package routes

import (
	"net/http"
	"time"

	services "net_monitor/Services"
	"net_monitor/websocket"

	"github.com/gin-gonic/gin"
)

func SetupWebSocketRoutes(
	router *gin.Engine,
	hub *websocket.Hub,
	snmpService *services.SNMPService,
) {
	router.GET("/ws/snmp", gin.WrapH(http.HandlerFunc(hub.ServeWS)))

	api := router.Group("/api/snmp")
	{
		api.POST("/start/:router_id", func(c *gin.Context) {
			routerID := c.Param("router_id")
			interval := 5 * time.Second

			if err := snmpService.StartCollection(routerID, interval); err != nil {
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
