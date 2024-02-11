import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ClientModel from '../models/ClientModel'
import fs from 'fs'


class ClientController{
    static async createUser(req: Request, res: Response){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: errors})
            }
            const {name, cnpj} = req.body
            
            let formattedCnpj: string
            if(cnpj.includes('/') || cnpj.includes('-')){
                formattedCnpj = cnpj.replace('-', '') && cnpj.replace('/', '')
            }else{
                formattedCnpj = cnpj
            }
            
            const addressByCnpj: {bairro:string,municipio: string, logradouro: string, numero: number, complemento: string} | undefined = await fetchAddress(formattedCnpj)
            if(addressByCnpj === undefined){
                res.status(400).json({message: `Ocorreu um erro ao buscar endereço do cliente com o CNPJ ${cnpj}. Verifique e tente novamente!`})
                return
            }
            const newClient = {
                name,
                cnpj,
                address: addressByCnpj

            }
            const clientModel = new ClientModel("./data/clients.json")
            clientModel.createClient(newClient)
            res.status(201).json({message: "Cliente cadastrado!"})
        }catch(error){
            res.status(500).json({message: "Ocorreu um erro ao processar a solicitação. Erro: " + error})
        }
    }
    static async getClients(req: Request, res: Response){
        try{
            const clientModel = new ClientModel("./data/clients.json")
            const allClients = clientModel.getAllClients()
            res.status(200).send({clients: allClients})
            
        }catch(error){
            res.status(500).json({message: "Ocorreu um erro ao processar a solicitação. Erro: " + error})
        }
    }
}
async function fetchAddress(cnpj: string): Promise< {bairro:string,municipio: string, logradouro: string, numero: number, complemento: string} | undefined >{
    try{
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data)
        const address: {bairro: string, municipio: string, logradouro: string,
        numero: number, complemento: string} = {
            municipio: data.municipio,
            bairro: data.bairro,
            logradouro: data.logradouro,
            numero: data.numero, 
            complemento: data.complemento
        }
        return address
    }catch(error){
        console.log("Ocorreu um erro ao buscar o endereço do cliente. Erro: "+ error)
        return undefined
    }
}
export default ClientController