import { Request, Response } from 'express';
import ClientController from '../controllers/ClientController';

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

      ClientController.createUser(req, res);

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

      ClientController.createUser(req, res)

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

      ClientController.createUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({message: expect.any(String)})
    })
  })
})
