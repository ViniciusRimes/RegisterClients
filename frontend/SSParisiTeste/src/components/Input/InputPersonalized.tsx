import { FormControl} from "@mui/material"
import FormLabel from "@mui/material/FormLabel/FormLabel"
import TextField from "@mui/material/TextField/TextField"
import React from "react"

interface InputProps{
    htmlFor: string, 
    text: string,
    id: string, 
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    placeholder: string, 
    required: boolean,
    maxLength: number | undefined,
    disabled: boolean,
}
const InputPersonalized: React.FC<InputProps> = ({htmlFor, text,  id, handleOnChange, value, placeholder, required, maxLength, disabled}) => {
  return (
    <FormControl sx={{width: 'calc(50% - 2em)', margin: '0.5em'}}>
        <FormLabel htmlFor= {htmlFor} sx={{opacity: disabled ? '0.5' : 1 ,color: '#6DBDE6', cursor: 'pointer', fontWeight: 'bold', fontFamily:'Poppins'}}>{text}</FormLabel>
        <TextField size="small" inputProps={maxLength ? {maxLength: maxLength} : undefined} name={htmlFor} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleOnChange(e)} value={value} required= {required} disabled={disabled} placeholder= {placeholder} id={id} variant='outlined' sx={{ margin: '0.5em 0em',opacity: disabled? '0.4' : 1 ,fontFamily: 'Poppins', '& input::placeholder': {
            fontFamily: 'Poppins',
            opacity: 0.7,
            fontSize: '0.8em'
        }}}/>
    </FormControl>
  )
}
export default InputPersonalized
