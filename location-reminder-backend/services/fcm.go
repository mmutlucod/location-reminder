package services

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

var fcmClient *messaging.Client

func InitFCM(credentialsPath string) error {
	ctx := context.Background()
	opt := option.WithCredentialsFile(credentialsPath)
	
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return err
	}

	fcmClient, err = app.Messaging(ctx)
	if err != nil {
		return err
	}

	log.Println("FCM initialized successfully")
	return nil
}

func SendNotification(token, title, body string, data map[string]string) error {
	// data map'ine title ve body'yi ekle
	if data == nil {
		data = make(map[string]string)
	}
	data["title"] = title
	data["body"] = body
	
	message := &messaging.Message{
		Token: token,
		Data: data,
		Android: &messaging.AndroidConfig{
			Priority: "high",
			Data: data,
		},
		APNS: &messaging.APNSConfig{
			Headers: map[string]string{
				"apns-priority": "10",
			},
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					ContentAvailable: true,
					MutableContent: true,
				},
			},
		},
	}

	ctx := context.Background()
	response, err := fcmClient.Send(ctx, message)
	if err != nil {
		log.Printf("Failed to send FCM message: %v", err)
		return err
	}

	log.Printf("Successfully sent message: %s", response)
	return nil
}