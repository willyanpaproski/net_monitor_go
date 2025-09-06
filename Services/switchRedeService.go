package services

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	utils "net_monitor/Utils"
)

type SwitchRedeService interface {
	GetAll() ([]models.SwitchRede, error)
	GetById(id string) (*models.SwitchRede, error)
	Create(switchRede *models.SwitchRede) error
	Update(id string, switchRede *models.SwitchRede) error
	Delete(id string) error
}

type switchRedeImpl struct {
	repo *repository.MongoRepository[models.SwitchRede]
}

func NewSwitchRedeService(repo *repository.MongoRepository[models.SwitchRede]) SwitchRedeService {
	return &switchRedeImpl{repo: repo}
}

func (s *switchRedeImpl) GetAll() ([]models.SwitchRede, error) {
	return s.repo.GetAll()
}

func (s *switchRedeImpl) GetById(id string) (*models.SwitchRede, error) {
	return s.repo.GetById(id)
}

func (s *switchRedeImpl) Create(switchRede *models.SwitchRede) error {
	hashedPassword, err := utils.HashPassword(switchRede.AccessPassword)
	if err != nil {
		return err
	}
	switchRede.AccessPassword = hashedPassword
	return s.repo.Create(switchRede)
}

func (s *switchRedeImpl) Update(id string, switchRede *models.SwitchRede) error {
	hashedPassword, err := utils.HashPassword(switchRede.AccessPassword)
	if err != nil {
		return err
	}
	switchRede.AccessPassword = hashedPassword
	return s.repo.Update(id, switchRede)
}

func (s *switchRedeImpl) Delete(id string) error {
	return s.repo.Delete(id)
}
