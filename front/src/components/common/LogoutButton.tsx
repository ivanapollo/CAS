"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import { deleteCookie } from 'cookies-next/client'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    deleteCookie('id')
    deleteCookie('role')
    deleteCookie('info')
    router.push("/")
    router.refresh()
  }

  return (
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          bgcolor: "white",
          color: "#1976d2",
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        ВЫЙТИ
      </Button>
  )
}
