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

func RoteadorSeeder(
	repo *repository.MongoRepository[models.Roteador],
	roteadorService services.RoteadorService,
) {
	integracoes := []models.RoteadorIntegracaoType{models.RoteadorMikrotik, models.RoteadorCisco, models.RoteadorJuniper}

	log.Printf("Roteador seeder initializated: %v", time.Now())

	for i := 1; i <= 50; i++ {
		randomNum := rand.Intn(3)

		roteador := &models.Roteador{
			Ativo:         true,
			Integracao:    integracoes[randomNum],
			Nome:          fmt.Sprintf("Roteador-%d", i),
			Descricao:     fmt.Sprintf("Roteador automático número %d", i),
			UsuarioAcesso: fmt.Sprintf("admin%d", i),
			SenhaAcesso:   "senha123",
			EnderecoIP:    fmt.Sprintf("192.168.1.%d", i),
			CommunitySnmp: "public",
			PortaSnmp:     "161",
		}
		err := roteadorService.Create(roteador)
		if err != nil {
			log.Fatalf("Error creating router %s: %v\n", roteador.Nome, err)
		} else {
			log.Printf("Router %s created successfully", roteador.Nome)
		}
	}

	log.Printf("Roteador seeder finished: %v", time.Now())
}
