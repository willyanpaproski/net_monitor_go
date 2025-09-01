package routes

import (
	controllers "net_monitor/Controllers"

	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(
	router *gin.Engine,
	userController *controllers.UserController,
) {
	api := router.Group("/api")
	{
		users := api.Group("/users")
		{
			users.GET("", userController.GetAllUsers)
			users.GET("/:id", userController.GetUserById)
			users.POST("", userController.CreateUser)
			users.PATCH("/:id", userController.UpdateUser)
			users.DELETE("/:id", userController.DeleteUser)
		}
	}
}
