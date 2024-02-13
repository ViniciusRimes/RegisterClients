import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import {Button} from '@mui/material'
import {ChangeEvent, useState, useEffect } from 'react'
import api from '../../helpers/axios'
import Messages from '../Messages/Messages'
import useFlashMessages from '../../hooks/useFlashMessages'

interface ApiResponse{
    message: string
}
interface ApiError{
    response: {
        data: {
            message: string
        }
    }
    message: string
}

const RegisterClient = () => {
    const [cnpj, setCnpj] = useState('')
    const [name, setName] = useState('')
    const [client, setClient] = useState({})
    const [formData, setFormData] = useState({
        name: '',
        cnpj: ''
    })
    const {setFlashMessages} = useFlashMessages()
    
    useEffect(()=>{
        setClient({
            name: name, 
            cnpj: cnpj
        })
    }, [cnpj, name])
    
    const handleSubmit = async (e: { preventDefault: () => void })=>{
        e.preventDefault()
        await registerClient()
    }
    const registerClient = async ()=>{
        try{
            const response = await api.post<ApiResponse>('/clients/register', client)
            setFlashMessages(response.data.message, 'success', 3000)  
            setTimeout(() => {
                setFormData({
                    name: '',
                    cnpj: ''
                })
            }, 3000);
        }catch(error){
            if(error instanceof Error && 'response' in error && error.response){
                const apiError = error as ApiError
                setFlashMessages(apiError.response.data.message, 'error', 3000)
            }else{
                const errorMessage = error as ApiError
                setFlashMessages(errorMessage.message, 'error', 3000)
            }
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void=>{
        const {value} = e.target
        let formattedCnpj: string = value.replace(/\D/g, '')

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
        const onlyNumbers: string = value.replace(/\D/g, '')
        setCnpj(onlyNumbers)
        setFormData(prevState=> ({
            ...prevState,
            cnpj: formattedCnpj

        }))
    }
    const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void=>{
        const {value} = e.target
        setName(value)
        setFormData(prevState=> ({
            ...prevState,
            name: value

        }))
    }
    return (
    <Box maxWidth={'600px'} sx={{backgroundColor: '#fff', margin: '0em auto', height: '100vh'}} color={'#000'} width={'100vw'} justifyContent={'space-evenly'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
        <Typography fontFamily={'Poppins'} variant='h1' fontWeight={'bold'} fontSize={'1.5em'}>Registro de Clientes</Typography>
        <form style={{display: 'flex', justifyContent: 'center', margin: '0em auto', width: '100%'}} onSubmit={handleSubmit}> 
        <FormControl sx={{ width: 'calc(100% - 4em)'}}>
            <FormLabel htmlFor='name'sx={{color: '#6DBDE6', cursor: 'pointer', fontWeight: 'bold', fontFamily:'Poppins'}}>Nome: *</FormLabel>
            <TextField onChange={(e)=>handleNameChange(e)} value={formData.name} required= {true} placeholder= 'Digite o nome do cliente 'id='name' variant='outlined' sx={{margin: '0.5em 0em' ,fontFamily: 'Poppins', '& input::placeholder': {
                fontFamily: 'Poppins',
                opacity: 0.7,
                fontSize: '0.8em'
            }}}/>
            <FormLabel htmlFor='cnpj'sx={{color: '#6DBDE6', cursor: 'pointer', fontWeight: 'bold', fontFamily:'Poppins', marginBottom: '0.5em', marginTop:'0.5em'}}>CNPJ: *</FormLabel>
            <TextField onChange={(e)=>handleInputChange(e)} required= {true}  placeholder= 'Digite o CNPJ do cliente(somente números) 'id='cnpj' variant='outlined' value={formData.cnpj} inputProps={{maxLength: 18}} sx={{fontFamily: 'Poppins', '& input::placeholder': {
                fontFamily: 'Poppins',
                opacity: 0.7,
                fontSize: '0.8em'
            }}}/>

            <Typography fontFamily={'Poppins'} variant='body1' sx={{marginTop: '2em', fontSize: '0.7em', fontWeight: 'bold'}}>* Os campos são obrigatórios</Typography>
            
            <Messages/> {/*Mensagens de sucesso ou erro na tela*/}

            <Button type="submit" sx={{color: '#000',border: '1px solid black', marginTop: '3em', borderRadius: '0.5em', fontFamily: 'Poppins', padding: '0.5em', fontWeight: 'bold',cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#6DBDE6',
                transition: 'all ease 0.2s',
            }}}>Cadastrar</Button>
        </FormControl>
        </form>
        
    </Box>
  )
}
export default RegisterClient

