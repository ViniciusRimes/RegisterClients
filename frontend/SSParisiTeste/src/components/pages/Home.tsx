import { ChangeEvent, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import api from "../../helpers/axios"
import Box from "@mui/material/Box";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import TypographyPersonalized from "../MaterialUiPersonalized/TypographyPersonalized";
interface Client {
  name: string;
  cnpj: string;
  address: {
    uf: string;
    cep: string;
    municipay: string;
    neighborhood: string;
    number: string;
    complement: string;
  };
}
const Home = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchValue, setSearchValue] = useState('');
  const [noCustomersFound, setNoCustomersFound ] = useState(false)

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

  useEffect(() => {
    const formattedClients = clients.map((client) => {
        const cnpj = client.cnpj;
        
        let formattedCnpj = cnpj.replace(/\D/g, '')

        if (formattedCnpj.length > 2) {
            formattedCnpj = formattedCnpj.replace(/^(\d{2})(\d)/, '$1.$2')
        }
        if (formattedCnpj.length > 5) {
            formattedCnpj = formattedCnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        }
        if (formattedCnpj.length > 8) {
            formattedCnpj = formattedCnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
        }
        if (formattedCnpj.length > 12) {
            formattedCnpj = formattedCnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
        }
        
        return {
            ...client,
            cnpj: formattedCnpj
        }
    })
    if (JSON.stringify(formattedClients) !== JSON.stringify(clients)) {
      setClients(formattedClients)
    }
    }, [clients])

    useEffect(() => {
      if (searchValue) {
          const formattedSearchValue = searchValue.replace(/[^\w\s]/g, '')
        
          const filtered = clients.filter(client => {
              const formattedCnpj = client.cnpj.replace(/\D/g, '')
              
              return client.name.toLowerCase().includes(formattedSearchValue.toLowerCase()) || 
              client.cnpj.includes(searchValue) || 
              formattedCnpj.includes(formattedSearchValue)
          });
  
          setFilteredClients(filtered);
          if(filtered.length > 0){
            setNoCustomersFound(false)
          }else{
            setNoCustomersFound(true)
          }
          
      } else {
        setFilteredClients(clients); 
        
      }
  }, [clients, searchValue, filteredClients.length, noCustomersFound])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>{
    setSearchValue(e.target.value)
  }
  
  return (
    <Box maxWidth={'1200px'} sx={{backgroundColor: '#fff', margin: '3em auto', height: '100vh'}} color={'#000'} width={'100vw'} justifyContent={'start'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
      <Box display={'flex'} alignItems={"center"} justifyContent={'start'} sx={{width: 'calc(100% - 2em)'}}>
        <FormControl sx={{width: 'calc(100%)', margin: '0em'}}>
          <TextField onChange={handleSearchChange} value={searchValue} size="small" type="search" placeholder="Buscar cliente (por nome ou CNPJ)" sx={{marginRight: '1em', fontFamily: 'Poppins', '& input::placeholder': {
              fontFamily: 'Poppins',
              opacity: 0.7,
              fontSize: '1em'
          }}}/>
        </FormControl>
      </Box>
      <Box margin={'2em 1em 1em 1em'}>
        <Button sx={{color: '#000',border: '1px solid black', borderRadius: '0.5em', fontFamily: 'Poppins', padding: '0.5em 1em', fontWeight: 'bold',cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#6DBDE6',
                transition: 'all ease 0.2s',
            }}}>
              <Link style={{textDecoration: 'none', color: "#000"}} to={'/client/register'}>Registrar novo cliente</Link>
        </Button>
      </Box>
      
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'} sx={{width: 'calc(100% - 2em)', margin: '1.5em 0.5em'}}>
      {clients.length > 0 && !noCustomersFound && (
      <Box display={'flex'} width={'100%'} justifyContent={'space-between'} paddingBottom={'1em'} sx={{borderBottom: '1px solid #6DBDE6'}}>
        <TypographyPersonalized fontWeight="bold" value='Nome'/>
        <TypographyPersonalized fontWeight="bold" value='CNPJ'/>
        <TypographyPersonalized fontWeight="bold" value='UF'/>
        <TypographyPersonalized fontWeight="bold" value='CEP'/>
        <TypographyPersonalized fontWeight="bold" value='MUNICÍPIO'/>
        <TypographyPersonalized fontWeight="bold" value='BAIRRO'/>
        <TypographyPersonalized fontWeight="bold" value='NÚMERO'/>
        <TypographyPersonalized fontWeight="bold" value='COMPLEMENTO'/>
        </Box>)}
        
        {clients.length === 0 ? ( 
          <Typography>Nenhum cliente cadastrado. Clique acima para registrar um novo cliente!</Typography>
        ) : clients.length > 0 && searchValue === '' ? (
        clients.map((client)=>(
          <Box minHeight={'50px'} padding={'0.2em'} display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} marginTop={'1em'} sx={{borderBottom: '1px solid #c1c1c1'}}>
              <TypographyPersonalized fontWeight="normal" value={client.name}/>
              <TypographyPersonalized fontWeight="normal" value={client.cnpj}/>
              <TypographyPersonalized fontWeight="normal" value={client.address.uf}/>
              <TypographyPersonalized fontWeight="normal" value={client.address.cep}/>
              <TypographyPersonalized fontWeight="normal" value={client.address.municipay}/>
              <TypographyPersonalized fontWeight="normal" value={client.address.neighborhood}/>
              <TypographyPersonalized fontWeight="normal" value={client.address.number}/>
              <TypographyPersonalized fontWeight="normal" value={client.address.complement}/>
          </Box>
        ))) : filteredClients.length > 0 ? (
        filteredClients.map((filtered)=>(
          <Box minHeight={'50px'} padding={'0.2em'} display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} marginTop={'1em'} sx={{borderBottom: '1px solid #c1c1c1'}}>
              <TypographyPersonalized fontWeight="normal" value={filtered.name}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.cnpj}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.address.uf}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.address.cep}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.address.municipay}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.address.neighborhood}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.address.number}/>
              <TypographyPersonalized fontWeight="normal" value={filtered.address.complement}/>
          </Box>
        ))
        ) :
        (<Typography>Nenhum cliente encontrado com estes parâmetros. Clique acima para registrar um novo cliente!</Typography>)}
      </Box>
    </Box>
  )
}

export default Home