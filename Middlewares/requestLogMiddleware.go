package middlewares

import (
	"log"
	models "net_monitor/Models"
	services "net_monitor/Services"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RequestLoggerMiddleware(logService services.RequestLogService) gin.HandlerFunc {
	return func(goGin *gin.Context) {
		start := time.Now()

		goGin.Next()

		duration := time.Since(start)

		requestLog := &models.RequestLog{
			Method:     goGin.Request.Method,
			Path:       goGin.Request.URL.Path,
			StatusCode: goGin.Writer.Status(),
			Duration:   duration.Microseconds(),
			ClientIP:   goGin.Request.RemoteAddr,
			UserAgent:  goGin.Request.UserAgent(),
			Timestamp:  primitive.NewDateTimeFromTime(start),
		}

		go func() {
			if err := logService.Create(requestLog); err != nil {
				log.Fatalf("Error creating request log: %v;    %v", err, requestLog)
			}
		}()
	}
}
