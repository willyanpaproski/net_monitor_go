package db

import (
	"context"
	"log"
	models "net_monitor/Models"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var MongoClient *mongo.Client

const DBName = "net_monitor"

func InitDatabase() {
	mongoURI := "mongodb://localhost:27017/net_monitor_go"

	clientOptions := options.Client().ApplyURI(mongoURI)

	var err error

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	MongoClient, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Error connecting with mongodb %v", err)
	}

	err = MongoClient.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatalf("Error making ping to mongodb %v", err)
	}

	log.Println("Connection with mongodb working")

	db := MongoClient.Database("net_monitor")
	roteadoresCollection := db.Collection("roteador")

	models.RoteadorIndexes(roteadoresCollection)
}

func GetCollection(collectionName string) *mongo.Collection {
	return MongoClient.Database(DBName).Collection(collectionName)
}
