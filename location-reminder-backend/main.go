package main

import (
	"log"

	"location-reminder/config"
	"location-reminder/models"
	"location-reminder/routes"
	"location-reminder/services"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()

	if err := services.InitFCM("firebase-credentials.json"); err != nil {
		log.Printf("FCM initialization failed (optional): %v", err)
	}

	gin.SetMode(config.AppConfig.GinMode)

	config.ConnectDB()
	defer config.CloseDB()

	if err := autoMigrate(); err != nil {
		log.Fatal("Migration failed:", err)
	}

	r := gin.Default()
	routes.SetupRoutes(r)

	log.Printf("Server starting on port %s", config.AppConfig.Port)
	if err := r.Run(":" + config.AppConfig.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func autoMigrate() error {
	log.Println("Running auto migration...")

	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Reminder{},
		&models.LocationLog{},
	)

	if err != nil {
		return err
	}

	log.Println("Auto migration completed successfully")
	return nil
}