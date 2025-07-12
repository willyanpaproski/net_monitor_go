package services

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	utils "net_monitor/Utils"
)

type RoteadorService interface {
	GetAll() ([]models.Roteador, error)
	Create(roteador *models.Roteador) error
	GetById(id string) (*models.Roteador, error)
	Update(id string, roteador *models.Roteador) error
	Delete(id string) error
}

type roteadorServiceImpl struct {
	repo *repository.MongoRepository[models.Roteador]
}

func NewRoteadorService(repo *repository.MongoRepository[models.Roteador]) RoteadorService {
	return &roteadorServiceImpl{repo: repo}
}

func (s *roteadorServiceImpl) GetAll() ([]models.Roteador, error) {
	return s.repo.GetAll()
}

func (s *roteadorServiceImpl) Create(roteador *models.Roteador) error {
	hashedPassword, err := utils.HashPassword(roteador.SenhaAcesso)
	if err != nil {
		return err
	}
	roteador.SenhaAcesso = hashedPassword
	return s.repo.Create(roteador)
}

func (s *roteadorServiceImpl) GetById(id string) (*models.Roteador, error) {
	return s.repo.GetById(id)
}

func (s *roteadorServiceImpl) Delete(id string) error {
	return s.repo.Delete(id)
}

func (s *roteadorServiceImpl) Update(id string, roteador *models.Roteador) error {
	return s.repo.Update(id, roteador)
}
