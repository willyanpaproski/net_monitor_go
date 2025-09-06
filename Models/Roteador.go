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
	ID             primitive.ObjectID     `json:"id,omitempty" bson:"_id,omitempty"`
	Active         bool                   `json:"active" bson:"active"`
	Integration    RoteadorIntegracaoType `json:"integration" bson:"integration"`
	Name           string                 `json:"name" bson:"name"`
	Description    string                 `json:"description" bson:"description"`
	AccessUser     string                 `json:"accessUser" bson:"accessUser"`
	AccessPassword string                 `json:"accessPassword" bson:"accessPassword"`
	IPAddress      string                 `json:"ipAddress" bson:"ipAddress"`
	SnmpCommunity  string                 `json:"snmpCommunity" bson:"snmpCommunity"`
	SnmpPort       string                 `json:"snmpPort" bson:"snmpPort"`
	Created_At     primitive.DateTime     `json:"created_at" bson:"created_at"`
	Updated_At     primitive.DateTime     `json:"updated_at" bson:"updated_at"`
}
