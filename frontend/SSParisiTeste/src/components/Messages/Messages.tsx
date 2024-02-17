import { useEffect, useState } from "react"
import bus from "../../helpers/bus"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography/Typography"

const Messages = () => {
    const [visibility, setVisibility] = useState(false)
    const [type, setType] = useState("")
    const [message, setMessage] = useState("")
    
    useEffect(()=>{
        bus.addListener('flash', ({message, type, time})=>{
            setVisibility(true)
            setMessage(message)
            setType(type)
            setTimeout(() => {
                setVisibility(false)   
            }, time);
        })
    })
    return (
        visibility && (
            <Box sx={{padding: '0.5em', margin: '2em auto', fontWeight: 'bold', backgroundColor: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#E6F2FF', border: type === 'success' ? '1px solid #c3e6cb' : type === 'error' ? '1px solid #f5c6db': '1px solid #4DA8DA', borderRadius: '0.5em', width: message.length - 50 ? '100%' : '70%'}} >
                <Typography textAlign={'center'}  color={type === 'success' ? '#155724': '#721c24'}>{message}</Typography>
            </Box>
        )
    )
}
export default Messages
