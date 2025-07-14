package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type SwitchRedeIntegracaoType string

const (
	SwitchCiscoCatalist SwitchRedeIntegracaoType = "ciscoCatalist"
	SwitchHuawei        SwitchRedeIntegracaoType = "huawei"
)

type SwitchRede struct {
	ID            primitive.ObjectID       `json:"id,omitempty" bson:"_id,omitempty"`
	Ativo         bool                     `json:"ativo" bson:"ativo"`
	Integracao    SwitchRedeIntegracaoType `json:"integracao" bson:"integracao"`
	Nome          string                   `json:"nome" bson:"nome"`
	Descricao     string                   `json:"descricao" bson:"descricao"`
	UsuarioAcesso string                   `json:"usuarioAcesso" bson:"usuarioAcesso"`
	SenhaAcesso   string                   `json:"senhaAcesso" bson:"senhaAcesso"`
	EnderecoIP    string                   `json:"enderecoIp" bson:"enderecoIp"`
	CommunitySnmp string                   `json:"communitySnmp" bson:"communitySnmp"`
	PortaSnmp     string                   `json:"portaSnmp" bson:"portaSnmp"`
}
