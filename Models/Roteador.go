package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RoteadorIntegracaoType string

const (
	RoteadorMikrotik RoteadorIntegracaoType = "mikrotik"
	RoteadorCisco    RoteadorIntegracaoType = "cisco"
	RoteadorJuniper  RoteadorIntegracaoType = "juniper"
)

type Roteador struct {
	ID            primitive.ObjectID     `json:"id,omitempty" bson:"_id,omitempty"`
	Ativo         bool                   `json:"ativo" bson:"ativo"`
	Integracao    RoteadorIntegracaoType `json:"integracao" bson:"integracao"`
	Nome          string                 `json:"nome" bson:"nome"`
	Descricao     string                 `json:"descricao" bson:"descricao"`
	UsuarioAcesso string                 `json:"usuarioAcesso" bson:"usuarioAcesso"`
	SenhaAcesso   string                 `json:"senhaAcesso" bson:"senhaAcesso"`
	EnderecoIP    string                 `json:"enderecoIp" bson:"enderecoIp"`
	CommunitySnmp string                 `json:"communitySnmp" bson:"communitySnmp"`
	PortaSnmp     string                 `json:"portaSnmp" bson:"portaSnmp"`
	Created_At    primitive.DateTime     `json:"created_at" bson:"created_at"`
	Updated_At    primitive.DateTime     `json:"updated_at" bson:"updated_at"`
}
