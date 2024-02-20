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
      if (searchValue) {
          const formattedSearchValue: string = searchValue.replace(/[^\w\s]/g, '')
        
          const filtered: Client[] = clients.filter(client => {
              const formattedCnpj: string= client.cnpj.replace(/\D/g, '')
              
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
    <Box maxWidth={'1200px'} color={'#000'} width={'100vw'} justifyContent={'start'} display={'flex'} alignItems={'center'} flexDirection={'column'} sx={{backgroundColor: '#fff', margin: '3em auto', height: '100vh', '@media (max-width: 600px)': {
      margin: '2em 0em'}
    }} >
      <Box display={'flex'} alignItems={"center"} justifyContent={'start'} sx={{width: 'calc(100% - 2em)'}}>
        <FormControl sx={{width: 'calc(100%)', margin: '0em'}}>
          <TextField onChange={handleSearchChange} value={searchValue} size="small" type="search" placeholder="Buscar cliente (por nome ou CNPJ)" sx={{marginRight: '1em', fontFamily: 'Poppins', '& input::placeholder': {
              fontFamily: 'Poppins',
              opacity: 0.7,
              fontSize: '1em'
          }, 
          '@media (max-width: 600px)': {
            '& input': {
              fontSize: '0.9em',
              paddingTop: '1em'
            }
          }
          }}/>
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
      <Box>
      {clients.length > 0 && searchValue === '' ? ( //VERSÃo MOBILE PARA A TABELA DE MOSTRAGEM DE CLIENTES
        clients.map((client)=>(
          <Box display={'none'} sx={{width: 'calc(100vw - 2em)' ,borderBottom: '1px solid #c2c2c2', marginBottom: '1em', paddingBottom: '0.5em', '@media (max-width: 600px)':{
            display: 'block'
          }}}>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>Nome:</span> {client.name} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>CNPJ:</span> {client.cnpj} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>UF:</span> {client.address.uf} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>CEP:</span> {client.address.cep} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>MUNICÍPIO:</span> {client.address.municipay} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>BAIRRO:</span> {client.address.neighborhood} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>NÚMERO:</span> {client.address.number} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>COMPLEMENTO:</span> {client.address.complement} </Typography>
          </Box>
        ))
      ) : filteredClients.length > 0 ? (
        filteredClients.map((filtered)=>(
          <Box display={'none'} sx={{width: 'calc(100vw - 2em)' ,borderBottom: '1px solid #c2c2c2', marginBottom: '1em', paddingBottom: '0.5em', '@media (max-width: 600px)':{
            display: 'block'
          }}}>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>Nome:</span> {filtered.name} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>CNPJ:</span> {filtered.cnpj} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>UF:</span> {filtered.address.uf} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>CEP:</span> {filtered.address.cep} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>MUNICÍPIO:</span> {filtered.address.municipay} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>BAIRRO:</span> {filtered.address.neighborhood} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>NÚMERO:</span> {filtered.address.number} </Typography>
            <Typography fontSize={'0.8em'}><span style={{fontWeight: 'bold'}}>COMPLEMENTO:</span> {filtered.address.complement} </Typography>
          </Box>
        ))
      ): <Typography display={'none'} sx={{'@media (max-width: 600px)':{
        display: 'block'}}}>Nenhum cliente encontrado com estes parâmetros. Clique acima para registrar um novo cliente!</Typography>}
      </Box>
      {clients.length > 0 && !noCustomersFound && ( //VERSÃo DESKTOP E OUTROS DISPOSIVOS (EXCETO MOBILE) PARA A TABELA DE MOSTRAGEM DE CLIENTES
      <Box display={'flex'} width={'100%'} justifyContent={'space-between'} paddingBottom={'1em'} sx={{borderBottom: '1px solid #6DBDE6', '@media (max-width: 600px)': {
        display: 'none'
      }}}>
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
          <Box minHeight={'50px'} padding={'0.2em'} display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} marginTop={'1em'} sx={{borderBottom: '1px solid #c1c1c1', '@media (max-width: 600px)': {
            display: 'none'
          }}}>
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
          <Box minHeight={'50px'} padding={'0.2em'} display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} marginTop={'1em'} sx={{borderBottom: '1px solid #c1c1c1',  '@media (max-width: 600px)': {
            display: 'none'}}}>
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
        (<Typography sx={{'@media (max-width: 600px)': {
          display: 'none'}}}>Nenhum cliente encontrado com estes parâmetros. Clique acima para registrar um novo cliente!</Typography>)}
      </Box>
    </Box>
  )
}

export default Home