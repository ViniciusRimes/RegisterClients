import fs from 'fs'

interface Client{
    name: string,
    cnpj: string,
    address: {bairro:string,municipio: string, logradouro: string, numero: number, complemento: string}
}
class ClientModel{
    private clients: Client[]
    private readonly filename: string

    constructor(filename: string){
        this.filename = filename,
        this.clients = this.loadClients()
    }

    public createClient(client:Client): void{
        this.clients.push(client)
        this.saveClient()
    }
    public getAllClients():Client[]{
        return this.clients
    }
    private saveClient(): void{
        try{
            fs.writeFileSync(this.filename, JSON.stringify(this.clients, null, 2), 'utf8' )
        }catch(error){
            console.log("Ocorreu um erro ao salvar cliente. Erro: " + error)
        }
    }
    private loadClients():Client[]{
        try{
            const data = fs.readFileSync(this.filename, 'utf8')
            return JSON.parse(data)
        }catch(error){
            console.log("Ocorreu um erro ao carregar os Clientes. Erro: " + error)
            return []
        }
    }
}
export default ClientModel