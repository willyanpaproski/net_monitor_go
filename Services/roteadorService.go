package services

import (
	models "net_monitor/Models"
	repository "net_monitor/Repository"
	utils "net_monitor/Utils"

	"go.mongodb.org/mongo-driver/bson"
)

type RoteadorService interface {
	GetAll() ([]models.Roteador, error)
	Create(roteador *models.Roteador) (error, *utils.APIError)
	GetById(id string) (*models.Roteador, error)
	Update(id string, roteador *models.Roteador) (error, *utils.APIError)
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

func (s *roteadorServiceImpl) Create(roteador *models.Roteador) (error, *utils.APIError) {
	router, errSearch := s.repo.GetByFilter(bson.M{"name": roteador.Name})
	if errSearch != nil {
		return errSearch, nil
	}
	if router != nil {
		return nil, &utils.APIError{
			Code:    "DUPLICATED_ROUTER_NAME",
			Message: "A router with that name already exists",
		}
	}
	hashedPassword, err := utils.HashPassword(roteador.AccessPassword)
	if err != nil {
		return err, nil
	}
	roteador.AccessPassword = hashedPassword
	return s.repo.Create(roteador), nil
}

func (s *roteadorServiceImpl) GetById(id string) (*models.Roteador, error) {
	return s.repo.GetById(id)
}

func (s *roteadorServiceImpl) Delete(id string) error {
	return s.repo.Delete(id)
}

func (s *roteadorServiceImpl) Update(id string, roteador *models.Roteador) (error, *utils.APIError) {
	router, errSearch := s.repo.GetByFilter(bson.M{"name": roteador.Name})
	if errSearch != nil {
		return errSearch, nil
	}
	if router != nil {
		return nil, &utils.APIError{
			Code:    "DUPLICATED_ROUTER_NAME",
			Message: "A router with that name already exists",
		}
	}

	hashedPassword, err := utils.HashPassword(roteador.AccessPassword)
	if err != nil {
		return err, nil
	}

	roteador.AccessPassword = hashedPassword

	return s.repo.Update(id, roteador), nil
}
