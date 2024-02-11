import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ClientModel from '../models/ClientModel'

class ClientController{
    static async createUser(req: Request, res: Response){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: errors})
            }
            const {name, cnpj} = req.body
            if (!/^[a-zA-Z]+$/.test(name)) {
                return res.status(400).json({ message: "O nome deve conter apenas letras" });
            }
            if(cnpj.length !== 14){
                return res.status(400).json({message: "CNPJ deve conter exatamente 14 caracteres"})
            }
            if (!/^\d+$/.test(cnpj)) {
                return res.status(400).json({ message: "CNPJ deve conter apenas números" });
            }
            let formattedCnpj: string
            if(cnpj.includes('/') || cnpj.includes('-')){
                formattedCnpj = cnpj.replace(/[-/]/g, '')
            }else{
                formattedCnpj = cnpj
            }
            
            const addressByCnpj: {bairro:string,municipio: string, logradouro: string, numero: number, complemento: string} | undefined = await fetchAddress(formattedCnpj)
            if(addressByCnpj === undefined){
                res.status(500).json({message: `Ocorreu um erro ao buscar endereço do cliente com o CNPJ ${cnpj}. Verifique e tente novamente!`})
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
        if(!response.ok){
            console.error(`Erro ao buscar o endereço do cliente. Status: ${response.status}`)
            if(response.status === 400){
                return undefined
            }
        }
        const data = await response.json()
        
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