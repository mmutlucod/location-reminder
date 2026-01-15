package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func ValidateRequest(c *gin.Context, obj interface{}) error {
	if err := c.ShouldBindJSON(obj); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			ErrorResponse(c, 400, formatValidationError(validationErrors))
			return err
		}
		ErrorResponse(c, 400, "Invalid request format")
		return err
	}
	return nil
}

func formatValidationError(errs validator.ValidationErrors) string {
	for _, err := range errs {
		switch err.Tag() {
		case "required":
			return err.Field() + " is required"
		case "email":
			return "Invalid email format"
		case "min":
			return err.Field() + " must be at least " + err.Param() + " characters"
		case "max":
			return err.Field() + " must be at most " + err.Param() + " characters"
		}
	}
	return "Validation error"
}
