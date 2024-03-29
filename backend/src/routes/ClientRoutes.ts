import express from "express"
const router = express()
import ClientController from '../controllers/ClientController'
import { body } from "express-validator"

router.post('/register', [
    body('name').notEmpty().withMessage("O campo NOME não pode ser nulo!"),
    body('cnpj').notEmpty().withMessage("O campo CNPJ não pode ser nulo!")
], ClientController.registerClient)

router.get('/', ClientController.getClients)

router.get('/address/:cnpj', ClientController.getAddressByCnpj)

export default router