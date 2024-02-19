import { Typography } from "@mui/material"
import React from "react"

interface InputProps{
  value: string | undefined,
  fontWeight: string,
}

const TypographyPersonalized: React.FC<InputProps> = ({value, fontWeight}) => {
  return (
    <Typography fontFamily={'Poppins'} sx={{textAlign: 'center', fontWeight: fontWeight}} width={'calc(100%/8)'} fontSize={'0.8em'}>
      {value}
    </Typography>
  )
}
export default TypographyPersonalized