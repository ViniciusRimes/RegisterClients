import { Request, Response } from 'express';
import ClientController from '../controllers/ClientController';
import ClientModel from '../models/ClientModel';

describe('ClientController', () => {
  describe('Registrando cliente', () => {
    it('Verifica se o nome fornecido possui apenas letras', () => {
      const req = {
        body: {
          name: 'Vinícius123', //Nome inválido
          cnpj: '12345678901234' //CNPJ válido
        }
      } as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      ClientController.registerClient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String)});
    })

    it('Verifica se o CNPJ fornecido contém exatos 14 dígitos', () => {
      const req = {
        body: {
          name: 'Vinícius Rimes', //Nome válido
          cnpj: '1234567890123' // CNPJ inválido
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      ClientController.registerClient(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String)})
    });

    it('Verifica se o CNPJ fornecido possui apenas números', () => {
      const req = {
        body: {
          name: 'Vinícius Rimes', // Nome válido
          cnpj: '12a456b8901234' // CNPJ inválido
        }
      } as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      ClientController.registerClient(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({message: expect.any(String)})
    })
  })
  describe('Obtendo clientes', ()=>{
    it('Verifica se os clientes cadastrados são retornados corretamente', ()=>{
      const mockClientes = [
      {
        name: 'Vinícius', 
        cnpj: '12345678901234', 
        address: {
          uf: 'RJ',
          cep: '28637000',
          neighborhood: 'Dona Mariana',
          municipay: 'Sumidouro',
          number: '1',
          complement: 'Casa azul'
        }
      }]
      jest.spyOn(ClientModel.prototype, 'getAllClients').mockReturnValue(mockClientes)
      const req = {} as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      } as unknown as Response

      ClientController.getClients(req, res)
      expect(ClientModel.prototype.getAllClients).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith({clients: mockClientes})
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})
