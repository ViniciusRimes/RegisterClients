import { useEffect, useState } from "react"
import api from "../../helpers/axios"
interface Client {
  name: string;
  cnpj: string;
  address: {
    uf?: string;
    cep?: string;
    municipio: string;
    bairro: string;
    logradouro: string;
    numero: string;
    complemento: string;
  };
}


const Home = () => {
  const [clients, setClients] = useState<Client[]>([])
  useEffect(()=>{
    async function fetchData(){
      try{
        const response = await api.get<{clients: Client[]}>('/clients')
        setClients(response.data.clients)
      }catch(error){
        console.log('Erro ao buscar clientes, Erro: ' + error)
      }
    }
    fetchData()
  }, [])
  console.log(clients)
  return (
    <p></p>
  )
}

export default Home