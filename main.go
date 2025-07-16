package main

import (
	"fmt"
	"log"
	initializer "net_monitor/Initializer"
	"net_monitor/db"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env %v", err)
	}

	db.InitDatabase()

	router := gin.Default()

	initializer.InitDependencies(router)

	if err := router.Run(":" + os.Getenv("APP_PORT")); err != nil {
		log.Fatalf("Erro ao iniciar servidor %v", err)
	}

	fmt.Println("Go net monitor started")
}
