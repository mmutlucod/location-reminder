package handlers

import (
	"fmt"
	"math"

	"location-reminder/config"
	"location-reminder/models"
	"location-reminder/services"
	"location-reminder/utils"

	"github.com/gin-gonic/gin"
)

func UpdateLocation(c *gin.Context) {
	userID := c.GetInt("user_id")
	var req models.LocationUpdateRequest
	if err := utils.ValidateRequest(c, &req); err != nil {
		return
	}

	locationLog := models.LocationLog{
		UserID:    uint(userID),
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Accuracy:  req.Accuracy,
	}

	if err := config.DB.Create(&locationLog).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to log location")
		return
	}

	var reminders []models.Reminder
	if err := config.DB.Where("user_id = ? AND is_active = ?", userID, true).
		Find(&reminders).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to check reminders")
		return
	}

	triggeredReminders := []models.Reminder{}
	for _, reminder := range reminders {
		distance := calculateDistance(
			req.Latitude,
			req.Longitude,
			reminder.Latitude,
			reminder.Longitude,
		)

		if distance <= float64(reminder.Radius) {
			triggeredReminders = append(triggeredReminders, reminder)
			
			var user models.User
			if err := config.DB.First(&user, userID).Error; err == nil && user.FCMToken != "" {
				services.SendNotification(
					user.FCMToken,
					reminder.Title,
					fmt.Sprintf("%s - You are within %dm", reminder.Description, reminder.Radius),
					map[string]string{
						"reminder_id": fmt.Sprintf("%d", reminder.ID),
						"type":        "location_reminder",
					},
				)
			}
		}
	}

	utils.SuccessResponse(c, 200, "Location updated", map[string]interface{}{
		"triggered_reminders": triggeredReminders,
		"location_logged":     true,
	})
}

func GetLocationHistory(c *gin.Context) {
	userID := c.GetInt("user_id")

	var logs []models.LocationLog
	if err := config.DB.Where("user_id = ?", userID).
		Order("created_at desc").
		Limit(100).
		Find(&logs).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch location history")
		return
	}

	utils.SuccessResponse(c, 200, "Location history retrieved", logs)
}

func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadius = 6371000

	lat1Rad := lat1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180
	deltaLat := (lat2 - lat1) * math.Pi / 180
	deltaLon := (lon2 - lon1) * math.Pi / 180

	a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(deltaLon/2)*math.Sin(deltaLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return earthRadius * c
}