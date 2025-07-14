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

func TransmissorFibraSeeder(
	repo *repository.MongoRepository[models.TransmissorFibra],
	transmissorFibraService services.TransmissorFibraService,
) {
	integracoes := []models.TransmissorFibraIntegracaoType{models.OltHuawei, models.OltZTE, models.OltDatacom}

	log.Printf("Transmissor fibra seeder initializated: %v", time.Now())

	for i := 0; i <= 50; i++ {
		randomNum := rand.Intn(3)

		transmissorFibra := &models.TransmissorFibra{
			Ativo:         true,
			Integracao:    integracoes[randomNum],
			Nome:          fmt.Sprintf("Transmissor-%d", i),
			Descricao:     fmt.Sprintf("Transmissor automático número %d", i),
			UsuarioAcesso: fmt.Sprintf("admin%d", i),
			SenhaAcesso:   "senha123",
			EnderecoIP:    fmt.Sprintf("192.168.1.%d", i),
			CommunitySnmp: "public",
			PortaSnmp:     "161",
		}
		err := transmissorFibraService.Create(transmissorFibra)
		if err != nil {
			log.Fatalf("Error creating router %s: %v\n", transmissorFibra.Nome, err)
		} else {
			log.Printf("Router %s created successfully", transmissorFibra.Nome)
		}
	}

	log.Printf("Transmissor fibra seeder finished: %v", time.Now())
}
