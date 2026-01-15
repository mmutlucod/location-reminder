package models

import (
	"time"
)

type LocationLog struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null;index"`
	Latitude  float64   `json:"latitude" gorm:"not null"`
	Longitude float64   `json:"longitude" gorm:"not null"`
	Accuracy  *float64  `json:"accuracy,omitempty"`
	CreatedAt time.Time `json:"created_at" gorm:"index:idx_location_logs_created_at,sort:desc"`
}

type LocationUpdateRequest struct {
	Latitude  float64  `json:"latitude" binding:"required"`
	Longitude float64  `json:"longitude" binding:"required"`
	Accuracy  *float64 `json:"accuracy"`
}
