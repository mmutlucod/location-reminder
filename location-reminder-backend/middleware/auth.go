package middleware

import (
	"strings"

	"location-reminder/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, 401, "Authorization header required")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			utils.ErrorResponse(c, 401, "Bearer token required")
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			utils.ErrorResponse(c, 401, "Invalid or expired token")
			c.Abort()
			return
		}

		c.Set("user_id", int(claims.UserID))
		c.Set("email", claims.Email)
		c.Next()
	}
}
