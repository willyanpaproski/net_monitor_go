package services

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	utils "net_monitor/Utils"

	"go.mongodb.org/mongo-driver/bson"
)

type SwitchRedeService interface {
	GetAll() ([]models.SwitchRede, error)
	Create(switchRede *models.SwitchRede) (error, *utils.APIError)
	GetById(id string) (*models.SwitchRede, error)
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

func (s *switchRedeImpl) Create(switchRede *models.SwitchRede) (error, *utils.APIError) {
	networkSwitch, errSearch := s.repo.GetByFilter(bson.M{"name": switchRede.Name})
	if errSearch != nil {
		return errSearch, nil
	}

	if networkSwitch != nil {
		return nil, &utils.APIError{
			Code:    "DUPLICATED_SWITCH_NAME",
			Message: "A switch with that name already exists",
		}
	}

	hashedPassword, err := utils.HashPassword(switchRede.AccessPassword)
	if err != nil {
		return err, nil
	}
	switchRede.AccessPassword = hashedPassword
	return s.repo.Create(switchRede), nil
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
