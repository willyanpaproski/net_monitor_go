package controllers

import (
	"net/http"
	models "net_monitor/Models"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

type SwitchRedeController struct {
	Service services.SwitchRedeService
}

func NewSwitchRedeController(service services.SwitchRedeService) *SwitchRedeController {
	return &SwitchRedeController{Service: service}
}

func (c *SwitchRedeController) GetAllSwitchesRede(goGin *gin.Context) {
	switchesRede, err := c.Service.GetAll()
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	goGin.JSON(http.StatusOK, switchesRede)
}

func (c *SwitchRedeController) GetSwitchRedeById(goGin *gin.Context) {
	id := goGin.Param("id")
	switchRede, err := c.Service.GetById(id)
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if switchRede == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Switch não encontrado"})
		return
	}
	goGin.JSON(http.StatusOK, switchRede)
}

func (c *SwitchRedeController) CreateSwitchRede(goGin *gin.Context) {
	var req models.SwitchRede
	if errValidation := goGin.ShouldBindJSON(&req); errValidation != nil {
		goGin.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	errCreate := c.Service.Create(&req)
	if errCreate != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errCreate.Error()})
		return
	}
	goGin.JSON(http.StatusCreated, req)
}

func (c *SwitchRedeController) UpdateSwitchRede(goGin *gin.Context) {
	id := goGin.Param("id")
	var req models.SwitchRede
	switchRede, errSearch := c.Service.GetById(id)
	if errSearch != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errSearch.Error()})
		return
	}
	if switchRede == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Switch não encontrado"})
		return
	}
	if errValidation := goGin.ShouldBindJSON(&req); errValidation != nil {
		goGin.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	errUpdate := c.Service.Update(id, &req)
	if errUpdate != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errUpdate.Error()})
		return
	}
	goGin.JSON(http.StatusOK, req)
}

func (c *SwitchRedeController) Delete(goGin *gin.Context) {
	id := goGin.Param("id")
	switchRede, errSearch := c.Service.GetById(id)
	if errSearch != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errSearch.Error()})
		return
	}
	if switchRede == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Switch não encontrado"})
		return
	}
	errDelete := c.Service.Delete(id)
	if errDelete != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errDelete.Error()})
		return
	}
	goGin.JSON(http.StatusNoContent, nil)
}
