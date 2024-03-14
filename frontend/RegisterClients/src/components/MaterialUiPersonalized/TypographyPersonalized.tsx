import { Typography } from "@mui/material"
import React from "react"

interface InputProps{
  value: string | undefined,
  fontWeight: string,
}

const TypographyPersonalized: React.FC<InputProps> = ({ value, fontWeight }) => {
  return (
    <Typography fontFamily={'Poppins'} width={'calc(100%/8)'}fontSize={'0.8em'} sx={{
        textAlign: 'center',
        fontWeight: fontWeight,
        '@media (max-width: 600px)': {
          height: '100vh',
          marginBottom: '0.2em',
          maxHeight: '50px',
          textAlign: 'start',
        }
      }}
    >
      {value}
    </Typography>
  )
}
export default TypographyPersonalized