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
    console.log(type)
    return (
        visibility && (
            <Box sx={{padding: '0.5em', marginTop: '2em', fontWeight: 'bold', backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da', border: type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6db', borderRadius: '0.5em'}} >
                <Typography textAlign={'center'}  color={type === 'success' ? '#155724': '#721c24'}>{message}</Typography>
            </Box>
        )
    )
}
export default Messages
