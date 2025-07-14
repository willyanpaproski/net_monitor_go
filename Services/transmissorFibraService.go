package services

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	utils "net_monitor/Utils"
)

type TransmissorFibraService interface {
	GetAll() ([]models.TransmissorFibra, error)
	Create(transmissorFibra *models.TransmissorFibra) error
	GetById(id string) (*models.TransmissorFibra, error)
	Update(id string, transmissorFibra *models.TransmissorFibra) error
	Delete(id string) error
}

type transmissorFibraImpl struct {
	repo *repository.MongoRepository[models.TransmissorFibra]
}

func NewTransmissorFibraService(repo *repository.MongoRepository[models.TransmissorFibra]) TransmissorFibraService {
	return &transmissorFibraImpl{repo: repo}
}

func (s *transmissorFibraImpl) GetAll() ([]models.TransmissorFibra, error) {
	return s.repo.GetAll()
}

func (s *transmissorFibraImpl) Create(transmissorFibra *models.TransmissorFibra) error {
	hashedPassword, err := utils.HashPassword(transmissorFibra.SenhaAcesso)
	if err != nil {
		return err
	}
	transmissorFibra.SenhaAcesso = hashedPassword
	return s.repo.Create(transmissorFibra)
}

func (s *transmissorFibraImpl) GetById(id string) (*models.TransmissorFibra, error) {
	return s.repo.GetById(id)
}

func (s *transmissorFibraImpl) Update(id string, transmissorFibra *models.TransmissorFibra) error {
	hashedPassword, err := utils.HashPassword(transmissorFibra.SenhaAcesso)
	if err != nil {
		return err
	}
	transmissorFibra.SenhaAcesso = hashedPassword
	return s.repo.Update(id, transmissorFibra)
}

func (s *transmissorFibraImpl) Delete(id string) error {
	return s.repo.Delete(id)
}
