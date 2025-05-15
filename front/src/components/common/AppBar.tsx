"use client"

import { Box } from "@mui/material"
import MuiAppBar from "@mui/material/AppBar"
import Typography from "@mui/material/Typography"
import Toolbar from "@mui/material/Toolbar"
import { LogoutButton } from "@/components/common/LogoutButton"
import { getCookie } from "cookies-next/client"

interface AppBarProps {
  role: string | null
}

export default function AppBar( { role } : AppBarProps) {
  const info = getCookie('info')
  return (
    <MuiAppBar position="absolute">
      <Toolbar sx={{ pr: "24px" }}>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Система учёта посещаемости
        </Typography>
        <Box display="flex">
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, mr: 3 }}>
          {info}
        </Typography>
        {role && <LogoutButton/>}
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
}
