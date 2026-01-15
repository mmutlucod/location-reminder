package models

import (
	"time"
)

type Reminder struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null;index"`
	Title       string    `json:"title" gorm:"not null;size:255"`
	Description string    `json:"description" gorm:"type:text"`
	Latitude    float64   `json:"latitude" gorm:"not null"`
	Longitude   float64   `json:"longitude" gorm:"not null"`
	Radius      int       `json:"radius" gorm:"not null;default:100"`
	IsActive    bool      `json:"is_active" gorm:"default:true;index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateReminderRequest struct {
	Title       string  `json:"title" binding:"required,min=3"`
	Description string  `json:"description"`
	Latitude    float64 `json:"latitude" binding:"required"`
	Longitude   float64 `json:"longitude" binding:"required"`
	Radius      int     `json:"radius" binding:"required,min=10,max=10000"`
}

type UpdateReminderRequest struct {
	Title       string  `json:"title" binding:"omitempty,min=3"`
	Description string  `json:"description"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Radius      int     `json:"radius" binding:"omitempty,min=10,max=10000"`
	IsActive    *bool   `json:"is_active"`
}
