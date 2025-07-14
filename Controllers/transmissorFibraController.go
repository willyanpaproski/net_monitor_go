package controllers

import (
	"net/http"
	models "net_monitor/Models"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

type TransmissorFibraController struct {
	Service services.TransmissorFibraService
}

func NewTransmissorFibraController(service services.TransmissorFibraService) *TransmissorFibraController {
	return &TransmissorFibraController{Service: service}
}

func (c *TransmissorFibraController) GetAllTransmissoresFibra(goGin *gin.Context) {
	transmissoresFibra, err := c.Service.GetAll()
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	goGin.JSON(http.StatusOK, transmissoresFibra)
}

func (c *TransmissorFibraController) GetTransmissorFibraById(goGin *gin.Context) {
	id := goGin.Param("id")
	transmissorFibra, err := c.Service.GetById(id)
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if transmissorFibra == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Transmissor de fibra não encontrado"})
		return
	}
	goGin.JSON(http.StatusOK, transmissorFibra)
}

func (c *TransmissorFibraController) CreateTransmissorFibra(goGin *gin.Context) {
	var req models.TransmissorFibra
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

func (c *TransmissorFibraController) UpdateTransmissorFibra(goGin *gin.Context) {
	id := goGin.Param("id")
	var req models.TransmissorFibra
	transmissorFibra, errSearch := c.Service.GetById(id)
	if errSearch != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errSearch.Error()})
		return
	}
	if transmissorFibra == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Transmissor de fibra não encontrado"})
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

func (c *TransmissorFibraController) DeleteTransmissorFibra(goGin *gin.Context) {
	id := goGin.Param("id")
	transmissorFibra, errSearch := c.Service.GetById(id)
	if errSearch != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errSearch.Error()})
		return
	}
	if transmissorFibra == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Transmissor de fibra não encontrado"})
		return
	}
	errDelete := c.Service.Delete(id)
	if errDelete != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": errDelete.Error()})
		return
	}
	goGin.JSON(http.StatusNoContent, nil)
}
