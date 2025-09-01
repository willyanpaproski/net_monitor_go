package models

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func RoteadorIndexes(collection *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	indexModel := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "ativo", Value: 1}},
			Options: options.Index().SetName("_ativo"),
		},
		{
			Keys:    bson.D{{Key: "integracao", Value: 1}},
			Options: options.Index().SetName("_integracao"),
		},
		{
			Keys:    bson.D{{Key: "nome", Value: 1}},
			Options: options.Index().SetUnique(true).SetName("_nome"),
		},
		{
			Keys:    bson.D{{Key: "descricao", Value: 1}},
			Options: options.Index().SetName("_descricao"),
		},
		{
			Keys:    bson.D{{Key: "usuarioAcesso", Value: 1}},
			Options: options.Index().SetName("_usuarioAcesso"),
		},
		{
			Keys:    bson.D{{Key: "enderecoIp", Value: 1}},
			Options: options.Index().SetName("_enderecoIp"),
		},
		{
			Keys:    bson.D{{Key: "communitySnmp", Value: 1}},
			Options: options.Index().SetName("_communitySnmp"),
		},
		{
			Keys:    bson.D{{Key: "portaSnmp", Value: 1}},
			Options: options.Index().SetName("_portaSnmp"),
		},
		{
			Keys:    bson.D{{Key: "created_at", Value: 1}},
			Options: options.Index().SetName("_created_at"),
		},
		{
			Keys:    bson.D{{Key: "updated_at", Value: 1}},
			Options: options.Index().SetName("_updated_at"),
		},
	}

	_, err := collection.Indexes().CreateMany(ctx, indexModel)
	if err != nil {
		log.Fatalf("Error creating indexes for Roteador: %v", err)
	}
}
