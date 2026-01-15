package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null;size:255"`
	Password  string    `json:"-" gorm:"not null;size:255"`
	Name      string    `json:"name" gorm:"not null;size:255"`
	FCMToken  string    `json:"-" gorm:"size:500"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Reminders    []Reminder    `json:"-" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	// LocationLogs []LocationLog `json:"-" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required,min=2"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
type UpdateFCMTokenRequest struct {
	FCMToken string `json:"fcm_token" binding:"required"`
}
