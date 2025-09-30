package initializer

import (
	controllers "net_monitor/Controllers"
	middlewares "net_monitor/Middlewares"
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	routes "net_monitor/Routes"
	mikrotik "net_monitor/SNMP/Mikrotik"
	services "net_monitor/Services"
	utils "net_monitor/Utils"
	"net_monitor/config"
	"net_monitor/db"
	"net_monitor/websocket"

	"github.com/gin-gonic/gin"
)

func InitDependencies(router *gin.Engine) {
	requestLogCollection := db.GetCollection("requestLogs")
	requestLogRepo := repository.NewMongoRepository[models.RequestLog](requestLogCollection)
	requestLogService := services.NewRequestLogService(requestLogRepo)

	router.Use(middlewares.RequestLoggerMiddleware(requestLogService))

	userCollection := db.GetCollection("user")
	userRepo := repository.NewMongoRepository[models.User](userCollection)
	userService := services.NewUserService(userRepo)

	oauthConfig := config.NewAuthConfig()
	jwtManager := utils.NewJWTManager(oauthConfig.JWTSecret)

	oauthRepoCollection := db.GetCollection("oauth_providers")
	oauthRepo := repository.NewMongoRepository[models.OAuthProvider](oauthRepoCollection)

	refreshTokensCollection := db.GetCollection("refresh_tokens")
	refreshTokenRepo := repository.NewMongoRepository[models.RefreshToken](refreshTokensCollection)

	authService := services.NewAuthService(userRepo, oauthRepo, refreshTokenRepo, userService, jwtManager, oauthConfig)
	authController := controllers.NewAuthController(authService)

	routes.SetupAuthRoutes(router, authController)

	userController := controllers.NewUserController(userService)
	routes.SetupUserRoutes(router, userController, authService)

	roteadorCollection := db.GetCollection("roteador")
	roteadorRepo := repository.NewMongoRepository[models.Roteador](roteadorCollection)
	roteadorService := services.NewRoteadorService(roteadorRepo)
	roteadorController := controllers.NewRoteadorController(roteadorService)
	routes.SetupRoteadorRoutes(router, roteadorController, authService)

	hub := websocket.NewHub(authService)
	go hub.Run()

	snmpService := services.NewSNMPService(hub, roteadorService)

	mikrotikCollector := mikrotik.NewMikrotikCollector()
	snmpService.RegisterCollector(mikrotikCollector)

	routes.SetupWebSocketRoutes(router, hub, snmpService)

	transmissorFibraCollection := db.GetCollection("transmissorFibra")
	transmissorFibraRepo := repository.NewMongoRepository[models.TransmissorFibra](transmissorFibraCollection)
	transmissorFibraService := services.NewTransmissorFibraService(transmissorFibraRepo)
	transmissorFibraController := controllers.NewTransmissorFibraController(transmissorFibraService)
	routes.SetupTransmissorFibraRoutes(router, transmissorFibraController, authService)

	switchRedeCollection := db.GetCollection("switchRede")
	switchRedeRepo := repository.NewMongoRepository[models.SwitchRede](switchRedeCollection)
	switchRedeService := services.NewSwitchRedeService(switchRedeRepo)
	switchRedeController := controllers.NewSwitchRedeController(switchRedeService)
	routes.SetupSwitchRedeRoutes(router, switchRedeController, authService)

	logCollection := db.GetCollection("log")
	logRepo := repository.NewMongoRepository[models.Log](logCollection)
	logService := services.NewLogService(logRepo)
	logController := controllers.NewLogController(logService)
	routes.SetupLogRoutes(router, logController, authService)

}
