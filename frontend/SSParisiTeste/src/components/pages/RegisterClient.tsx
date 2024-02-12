import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import {Input} from '@mui/material'
import { ChangeEvent, useState } from 'react'

const RegisterClient = () => {
    const [cnpj, setCnpj] = useState('')
    
    const handleSubmit = (e: { preventDefault: () => void })=>{
        e.preventDefault()
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
        setCnpj(formattedCnpj)
    }
    return (
    <Box sx={{backgroundColor: '#fff', margin: '0em auto', height: '100vh'}} color={'#000'} width={'100vw'} justifyContent={'space-evenly'} display={'flex'} alignItems={'center'} flexDirection={'column'} >
        <Typography fontFamily={'Poppins'} variant='h1' fontWeight={'bold'} fontSize={'1.5em'}>Registro de Clientes</Typography>
        <form style={{display: 'flex', justifyContent: 'center', margin: '0em auto', width: '100%'}} onSubmit={handleSubmit}> 
        <FormControl sx={{ width: 'calc(100% - 4em)'}}>
            <FormLabel htmlFor='name'sx={{color: '#000', fontWeight: 'bold', fontFamily:'Poppins'}}>Nome: *</FormLabel>
            <TextField required= {true} placeholder= 'Digite o nome do cliente 'id='name' variant='outlined' sx={{margin: '0.5em 0em' ,fontFamily: 'Poppins', '& input::placeholder': {
                fontFamily: 'Poppins',
                opacity: 0.7,
                fontSize: '0.9em'
            }}}/>
            <FormLabel htmlFor='cnpj'sx={{color: '#000', fontWeight: 'bold', fontFamily:'Poppins', marginBottom: '0.5em', marginTop:'0.5em'}}>CNPJ: *</FormLabel>
            <TextField onChange={(e)=>handleInputChange(e)} required= {true} placeholder= 'Digite o CNPJ do cliente(somente números) 'id='name' variant='outlined' value={cnpj} inputProps={{maxLength: 17}} sx={{fontFamily: 'Poppins', '& input::placeholder': {
                fontFamily: 'Poppins',
                opacity: 0.7,
                fontSize: '0.9em'
            }}}/>
            <Typography fontFamily={'Poppins'} variant='body1' sx={{marginTop: '2em', fontSize: '0.7em', fontWeight: 'bold'}}>* Os campos são obrigatórios</Typography>
            <Input sx={{border: '1px solid black', marginTop: '4em'}} type='submit'/>
        </FormControl>
        </form>
        
    </Box>
  )
}
export default RegisterClient
