package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Ativo        bool               `json:"ativo" bson:"ativo"`
	EmailUsuario string             `json:"emailUsuario" bson:"emailUsuario"`
	SenhaUsuario string             `json:"senhaUsuario" bson:"senhaUsuario"`
	Created_At   primitive.DateTime `json:"created_at" bson:"created_at"`
	Updated_At   primitive.DateTime `json:"updated_at" bson:"updated_at"`
}
