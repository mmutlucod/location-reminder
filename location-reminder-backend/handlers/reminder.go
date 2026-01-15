package handlers

import (
	"strconv"

	"location-reminder/config"
	"location-reminder/models"
	"location-reminder/utils"

	"github.com/gin-gonic/gin"
)

func CreateReminder(c *gin.Context) {
	userID := c.GetInt("user_id")
	var req models.CreateReminderRequest
	if err := utils.ValidateRequest(c, &req); err != nil {
		return
	}

	reminder := models.Reminder{
		UserID:      uint(userID),
		Title:       req.Title,
		Description: req.Description,
		Latitude:    req.Latitude,
		Longitude:   req.Longitude,
		Radius:      req.Radius,
	}

	if err := config.DB.Create(&reminder).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to create reminder")
		return
	}

	utils.SuccessResponse(c, 201, "Reminder created successfully", reminder)
}

func GetReminders(c *gin.Context) {
	userID := c.GetInt("user_id")

	var reminders []models.Reminder
	if err := config.DB.Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&reminders).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch reminders")
		return
	}

	utils.SuccessResponse(c, 200, "Reminders retrieved", reminders)
}

func GetReminder(c *gin.Context) {
	userID := c.GetInt("user_id")
	reminderID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid reminder ID")
		return
	}

	var reminder models.Reminder
	if err := config.DB.Where("id = ? AND user_id = ?", reminderID, userID).
		First(&reminder).Error; err != nil {
		utils.ErrorResponse(c, 404, "Reminder not found")
		return
	}

	utils.SuccessResponse(c, 200, "Reminder retrieved", reminder)
}

func UpdateReminder(c *gin.Context) {
	userID := c.GetInt("user_id")
	reminderID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid reminder ID")
		return
	}

	var req models.UpdateReminderRequest
	if err := utils.ValidateRequest(c, &req); err != nil {
		return
	}

	var reminder models.Reminder
	if err := config.DB.Where("id = ? AND user_id = ?", reminderID, userID).
		First(&reminder).Error; err != nil {
		utils.ErrorResponse(c, 404, "Reminder not found")
		return
	}

	updates := make(map[string]interface{})

	if req.Title != "" {
		updates["title"] = req.Title
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.Latitude != 0 {
		updates["latitude"] = req.Latitude
	}
	if req.Longitude != 0 {
		updates["longitude"] = req.Longitude
	}
	if req.Radius != 0 {
		updates["radius"] = req.Radius
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	if err := config.DB.Model(&reminder).Updates(updates).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to update reminder")
		return
	}

	config.DB.First(&reminder, reminderID)

	utils.SuccessResponse(c, 200, "Reminder updated successfully", reminder)
}

func DeleteReminder(c *gin.Context) {
	userID := c.GetInt("user_id")
	reminderID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid reminder ID")
		return
	}

	result := config.DB.Where("id = ? AND user_id = ?", reminderID, userID).
		Delete(&models.Reminder{})

	if result.Error != nil {
		utils.ErrorResponse(c, 500, "Failed to delete reminder")
		return
	}

	if result.RowsAffected == 0 {
		utils.ErrorResponse(c, 404, "Reminder not found")
		return
	}

	utils.SuccessResponse(c, 200, "Reminder deleted successfully", nil)
}
