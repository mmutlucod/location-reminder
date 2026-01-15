package routes

import (
	"location-reminder/handlers"
	"location-reminder/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/profile", handlers.GetProfile)
			protected.PUT("/fcm-token", handlers.UpdateFCMToken)

			reminders := protected.Group("/reminders")
			{
				reminders.POST("", handlers.CreateReminder)
				reminders.GET("", handlers.GetReminders)
				reminders.GET("/:id", handlers.GetReminder)
				reminders.PUT("/:id", handlers.UpdateReminder)
				reminders.DELETE("/:id", handlers.DeleteReminder)
			}

			location := protected.Group("/location")
			{
				location.POST("/update", handlers.UpdateLocation)
				location.GET("/history", handlers.GetLocationHistory)
			}
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Location Reminder API is running",
		})
	})
}