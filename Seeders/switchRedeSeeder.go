package Seeders

import (
	"fmt"
	"log"
	"math/rand"
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	services "net_monitor/Services"
	"time"
)

func SwitchRedeSeeder(
	repo *repository.MongoRepository[models.SwitchRede],
	switchRedeService services.SwitchRedeService,
) {
	integracoes := []models.SwitchRedeIntegracaoType{models.SwitchCiscoCatalist, models.SwitchHuawei}

	log.Printf("Switch seeder initializated: %v", time.Now())

	for i := 0; i <= 50; i++ {
		randomNum := rand.Intn(2)

		switchRede := &models.SwitchRede{
			Ativo:         true,
			Integracao:    integracoes[randomNum],
			Nome:          fmt.Sprintf("Switch-%d", i),
			Descricao:     fmt.Sprintf("Switch automático número %d", i),
			UsuarioAcesso: fmt.Sprintf("admin%d", i),
			SenhaAcesso:   "senha123",
			EnderecoIP:    fmt.Sprintf("192.168.1.%d", i),
			CommunitySnmp: "public",
			PortaSnmp:     "161",
		}
		err := switchRedeService.Create(switchRede)
		if err != nil {
			log.Fatalf("Error creating router %s: %v\n", switchRede.Nome, err)
		} else {
			log.Printf("Router %s created successfully", switchRede.Nome)
		}
	}

	log.Printf("Switch seeder finished: %v", time.Now())
}
