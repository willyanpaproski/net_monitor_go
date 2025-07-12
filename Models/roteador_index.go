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

	//Indexa nessa jabirosca so o que for unique ou utilizado pra filtro
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
	}

	_, err := collection.Indexes().CreateMany(ctx, indexModel)
	if err != nil {
		log.Fatalf("Error creating unique index for Roteador.nome: %v", err)
	}
}
