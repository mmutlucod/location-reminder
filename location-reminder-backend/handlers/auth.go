package handlers

import (
	"location-reminder/config"
	"location-reminder/models"
	"location-reminder/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := utils.ValidateRequest(c, &req); err != nil {
		return
	}

	var existingUser models.User
	if err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		utils.ErrorResponse(c, 400, "Email already registered")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to hash password")
		return
	}

	user := models.User{
		Email:    req.Email,
		Password: string(hashedPassword),
		Name:     req.Name,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to create user")
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate token")
		return
	}

	user.Password = ""

	utils.SuccessResponse(c, 201, "User registered successfully", models.LoginResponse{
		Token: token,
		User:  user,
	})
}

func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := utils.ValidateRequest(c, &req); err != nil {
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ErrorResponse(c, 401, "Invalid email or password")
			return
		}
		utils.ErrorResponse(c, 500, "Database error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		utils.ErrorResponse(c, 401, "Invalid email or password")
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate token")
		return
	}

	user.Password = ""

	utils.SuccessResponse(c, 200, "Login successful", models.LoginResponse{
		Token: token,
		User:  user,
	})
}

func GetProfile(c *gin.Context) {
	userID := c.GetInt("user_id")

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ErrorResponse(c, 404, "User not found")
			return
		}
		utils.ErrorResponse(c, 500, "Database error")
		return
	}

	user.Password = ""
	utils.SuccessResponse(c, 200, "Profile retrieved", user)
}

func UpdateFCMToken(c *gin.Context) {
	userID := c.GetInt("user_id")
	
	var req models.UpdateFCMTokenRequest
	if err := utils.ValidateRequest(c, &req); err != nil {
		return
	}

	if err := config.DB.Model(&models.User{}).Where("id = ?", userID).Update("fcm_token", req.FCMToken).Error; err != nil {
		utils.ErrorResponse(c, 500, "Failed to update FCM token")
		return
	}

	utils.SuccessResponse(c, 200, "FCM token updated successfully", nil)
}