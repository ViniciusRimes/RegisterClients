import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import {Button} from '@mui/material'
import {ChangeEvent, useState, useEffect } from 'react'
import api from '../../helpers/axios'
import Messages from '../Messages/Messages'
import useFlashMessages from '../../hooks/useFlashMessages'
import InputPersonzalized from '../MaterialUiPersonalized/InputPersonalized'
import { Link } from 'react-router-dom'

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
    const [cnpjIsValid, setCnpjIsValid] = useState(false) 
    const [name, setName] = useState('') 
    const [client, setClient] = useState({}) 
    const [formData, setFormData] = useState({ 
        name: '',
        cnpj: ''
    })
    const [address, setAddress] = useState({ 
        uf: "",
        cep: "",
        municipay: "",
        neighborhood: "",
        number: "",
        complement: ""
    })
    const {setFlashMessages} = useFlashMessages()

    useEffect(()=>{
        setClient({
            name: name, 
            cnpj: cnpj,
            address: address
        })
    }, [cnpj, name, address])
    
    useEffect(()=>{ 
        if(cnpj.length === 14){
            setFlashMessages('Buscando endereço', 'loading', 1499)
            setTimeout(async() => {
                try{
                    const response = await api.get(`/clients/address/${cnpj}`)
                    if(response.status === 200){
                        setCnpjIsValid(true)
                    }
                    const address = response.data.address
                    const cep = address.cep.replace(/\D/g, '')
                    const cepFormatted =  cep.replace(/^(\d{5})(\d)/, '$1-$2')
                    setAddress({
                        uf: address.uf ? address.uf : "",
                        cep: address.cep ? cepFormatted : "",
                        municipay: address.município ? address.município : "",
                        neighborhood: address.bairro ? address.bairro : "",
                        number: address.numero ? address.numero : "",
                        complement: address.complemento ? address.complemento : "",
                    })
                }catch(error){
                    if(error instanceof Error && 'response' in error && error.response){
                        setAddress({
                            uf: "",
                            cep: "",
                            municipay: "",
                            neighborhood: "",
                            number: "",
                            complement: ""
                        })
                        const apiError = error as ApiError
                        setFlashMessages(apiError.response.data.message, 'error', 2500)
                        setTimeout(() => {
                            setCnpjIsValid(true)
                        }, 3000);
                    }else{
                        const errorMessage = error as ApiError
                        setFlashMessages(errorMessage.message, 'error', 1000)
                    }
                }
            }, 1500);
        }
    }, [cnpj])
    const handleSubmit = async (e: { preventDefault: () => void })=>{
        e.preventDefault()
        await registerClient()
    }
    const registerClient = async ()=>{ 
        try{
            const response = await api.post<ApiResponse>('/clients/register', client)
            setFlashMessages(response.data.message, 'success', 1500)  
            setTimeout(() => {
                setFormData({
                    name: '',
                    cnpj: ''
                })
                setAddress({
                    uf: "",
                    cep: "",
                    municipay: "",
                    neighborhood: "",
                    number: "",
                    complement: ""
                })
                setCnpjIsValid(false)
            }, 1500);
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
    
    const handleCnpjChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void=>{ 
        const {value} = e.target

        let formattedCnpj: string = value.replace(/\D/g, '')
        
        if(formattedCnpj.length !== 14){
            setCnpjIsValid(false)
        }
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
        setFormData(prevState=> ({
            ...prevState,
            cnpj: formattedCnpj

        }))
        
        const onlyNumbers: string = value.replace(/\D/g, '')
        setCnpj(onlyNumbers)
    }
    const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void=>{ 
        const {value} = e.target
        setName(value)
        setFormData(prevState=> ({
            ...prevState,
            name: value

        }))
    }
    const handleAddressChange   = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void=>{
        const {value} = e.target
        setAddress(prevState =>({
            ...prevState,
            [e.target.name]: value
        }))
    }

    return (
    <Box maxWidth={'900px'} sx={{backgroundColor: '#fff', margin: '3em auto', height: '100vh'}} color={'#000'} width={'100vw'} justifyContent={'center'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
        <Typography fontFamily={'Poppins'} variant='h1' fontWeight={'bold'} marginBottom={'1em'} fontSize={'1.5em'}>Registro de Clientes</Typography>
        <Typography margin={'1.5em 0.5em 0.5em 0.5em'} fontFamily={'Poppins'} variant='body1'>Digite os dados abaixo para cadastrar um novo cliente no sistema</Typography>
        <Typography margin={'0.5em'}  fontFamily={'Poppins'} variant='body1'>Após preencher os campos <span style={{fontWeight: 'bold'}}>Nome</span> e <span style={{fontWeight: 'bold'}}>CNPJ</span> abaixo, será buscado os dados de endereço do cliente</Typography>
        <Typography margin={'1.5em 0.5em 0.5em 0.5em'} fontFamily={'Poppins'} variant='body1'>Ou clique <Link style={{textDecoration: 'none', backgroundColor: '#6DBDE6', padding: '0.2em', color: '#000'}} to={'/'}>aqui</Link> para consultar todos os clientes cadastrados</Typography>
        <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '0em auto', marginBottom: '1em', width: '100%'}} onSubmit={handleSubmit}> 
        <Box sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%', marginTop: '3em'}}>
            <InputPersonzalized htmlFor='name' text='Nome *' id='name' handleOnChange={handleNameChange} required={true} placeholder='Digite o nome do cliente' value={formData.name} maxLength={undefined}/>
            <InputPersonzalized htmlFor='cnpj' text = 'CNPJ *'  id='cnpj' handleOnChange={handleCnpjChange} required = {true} placeholder='Digite o CNPJ do cliente' value={formData.cnpj} maxLength={18}/>
            {cnpjIsValid && (
                <>
                <InputPersonzalized htmlFor='uf' text = 'UF *'  id='uf' handleOnChange={handleAddressChange} required = {true} placeholder='' value={address.uf} maxLength={undefined}/>
                <InputPersonzalized htmlFor='cep' text = 'CEP *'  id='cep' handleOnChange={handleAddressChange} required = {true} placeholder='' value={address.cep} maxLength={undefined}/>
                <InputPersonzalized htmlFor='municipay' text = 'Município *'  id='municipay' handleOnChange={handleAddressChange} required = {true} placeholder='' value={address.municipay} maxLength={undefined}/>
                <InputPersonzalized htmlFor='neighborhood' text = 'Bairro *'  id='neighborhood' handleOnChange={handleAddressChange} required = {true} placeholder='' value={address.neighborhood} maxLength={undefined}/>
                <InputPersonzalized htmlFor='number' text = 'Número'  id='number' handleOnChange={handleAddressChange} required = {false} placeholder='' value={address.number} maxLength={undefined}/>
                <InputPersonzalized htmlFor='complement' text = 'Complemento'  id='complemento' handleOnChange={handleAddressChange} required = {false} placeholder='' value={address.complement} maxLength={undefined}/>
                </>
            )}
        </Box>
        <Box marginTop={'0em'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography fontFamily={'Poppins'} variant='body1' sx={{marginTop: '2em', textAlign: 'center', fontSize: '0.7em', fontWeight: 'bold'}}>* Os campos são obrigatórios</Typography>
            <Messages/> {/*Mensagens de sucesso ou erro na tela*/}
        </Box>
        <FormControl sx={{display: 'flex', alignItems: 'center'}}>
            <Button disabled={!cnpjIsValid} type="submit" sx={{color: '#000',border: '1px solid black', marginBottom: '1em', marginTop: '2em', borderRadius: '0.5em', fontFamily: 'Poppins', padding: '0.7em 1em', fontWeight: 'bold',cursor: 'pointer',
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

