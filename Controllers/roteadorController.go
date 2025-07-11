package controllers

import (
	"net/http"
	models "net_monitor/Models"
	services "net_monitor/Services"

	"github.com/gin-gonic/gin"
)

type RoteadorController struct {
	Service services.RoteadorService
}

func NewRoteadorController(service services.RoteadorService) *RoteadorController {
	return &RoteadorController{Service: service}
}

func (c *RoteadorController) GetAll(goGin *gin.Context) {
	roteadores, err := c.Service.GetAll()
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	goGin.JSON(http.StatusOK, roteadores)
}

func (c *RoteadorController) GetById(goGin *gin.Context) {
	id := goGin.Param("id")
	roteador, err := c.Service.GetById(id)
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if roteador == nil {
		goGin.JSON(http.StatusNotFound, gin.H{"error": "Roteador não encontrado"})
		return
	}
	goGin.JSON(http.StatusOK, roteador)
}

func (c *RoteadorController) Create(goGin *gin.Context) {
	var req models.Roteador
	if err := goGin.ShouldBindJSON(&req); err != nil {
		goGin.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	err := c.Service.Create(&req)
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	goGin.JSON(http.StatusCreated, req)
}

func (c *RoteadorController) Update(goGin *gin.Context) {
	id := goGin.Param("id")
	var req models.Roteador
	if err := goGin.ShouldBindJSON(&req); err != nil {
		goGin.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	err := c.Service.Update(id, &req)
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": "Dados inválidos"})
		return
	}
	goGin.JSON(http.StatusOK, req)
}

func (c *RoteadorController) Delete(goGin *gin.Context) {
	id := goGin.Param("id")
	err := c.Service.Delete(id)
	if err != nil {
		goGin.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	goGin.JSON(http.StatusNoContent, nil)
}
