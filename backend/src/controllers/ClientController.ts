import { Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import ClientModel from '../models/ClientModel'

class ClientController{
    static async registerClient(req: Request, res: Response){
        try{
            const errors: Result<ValidationError> = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: errors})
            }
            const {name, cnpj, address} = req.body
            const {uf, cep, municipay, neighborhood, number, complement} = address
            
            if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
                return res.status(400).json({ message: "O nome deve conter apenas letras e espaços" });
            }
            if(cnpj.length !== 14){
                return res.status(400).json({message: "CNPJ deve conter exatamente 14 caracteres"})
            }
            if (!/^\d+$/.test(cnpj)) {
                return res.status(400).json({ message: "CNPJ deve conter apenas números" });
            }
            let formattedCnpj: string = cnpj
        
            if(formattedCnpj.length > 2){
                formattedCnpj = formattedCnpj.replace(/^(\d{2})(\d)/, '$1.$2')
            }
            if(formattedCnpj.length > 5){
                formattedCnpj = formattedCnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            }
            if(formattedCnpj.length > 8){
            formattedCnpj = formattedCnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
            }
            if(formattedCnpj.length > 12){
            formattedCnpj = formattedCnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
            }
            
            const newClient: {name: string, cnpj: string, address: {uf: string, cep: string, neighborhood:string,municipay: string, number: string, complement: string}} = {
                name,
                cnpj: formattedCnpj,
                address: {
                    uf,
                    cep,
                    municipay,
                    neighborhood,
                    number,
                    complement
                }

            }
            const clientModel: ClientModel = new ClientModel("./data/clients.json")
            clientModel.createClient(newClient)
            res.status(201).json({message: "Cliente cadastrado com sucesso!", client: newClient})
        }catch(error){
            res.status(500).json({message: "Ocorreu um erro ao processar a solicitação. Erro: " + error})
        }
    }
    static async getClients(req: Request, res: Response){
        try{
            const clientModel: ClientModel = new ClientModel("./data/clients.json")
            const allClients = clientModel.getAllClients()
            res.status(200).send({clients: allClients})
            
        }catch(error){
            res.status(500).json({message: "Ocorreu um erro ao processar a solicitação. Erro: " + error})
        }
    }
    static async getAddressByCnpj(req: Request, res: Response){
        try{
            const {cnpj} = req.params
            const addressByCnpj: {uf: string, cep: string, neighborhood:string,municipay: string, number: string, complement: string} | undefined = await fetchAddress(cnpj)
            if(addressByCnpj === undefined){
                res.status(400).json({message: `Endereço não encontrado para o CNPJ informado. Verifique o CNPJ ou cadastre manualmente!`})
                return
            }
            res.status(200).send({address: {
                uf: addressByCnpj.uf,
                cep: addressByCnpj.cep,
                município: addressByCnpj.municipay,
                bairro: addressByCnpj.neighborhood,
                numero: addressByCnpj.number,
                complemento: addressByCnpj.complement
            }})
        }   
        catch(error){
            res.status(500).json({message: "Ocorreu um erro ao processar a solicitação. Erro: " + error})
        }
    }
}
async function fetchAddress(cnpj: string): Promise< {uf: string, cep: string, neighborhood:string,municipay: string, number: string, complement: string} | undefined >{
    try{
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(!response.ok){ 
            if(response.status === 400){
                return undefined
            }
        }
        const data = await response.json()
        
        const address: {uf: string, cep: string, neighborhood: string, municipay: string, number: string, complement: string} = {
            uf: data.uf,
            cep: data.cep,
            municipay: data.municipio ? data.municipio : "Não fornecido",
            neighborhood: data.bairro ? data.bairro : "Não fornecido",
            number: data.numero ? data.numero : "Não fornecido", 
            complement: data.complemento ? data.complemento : "Não fornecido"
        }
        return address
    }catch(error){
        console.log("Ocorreu um erro ao buscar o endereço do cliente. Erro: "+ error)
        return undefined
    }
}
export default ClientController