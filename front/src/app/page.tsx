"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material"
import type { Login } from "@/lib/types"
import { loginAPI } from "@/lib/api"
import { setCookie } from "cookies-next/client"

const roleMap = new Map<string, string>([
  ["Студент", "student"],
  ["Преподаватель", "teacher"],
  ["Сотрудник дирекции", "admin"]
])

const timeExp = 60 * 60 * 1000

export default function LoginPage() {
  const router = useRouter()
  const [loginData, setLoginData] = useState<Login>({
    login: "",
    password: "",
  })
  // const [error, setError] = useState()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await loginAPI.login(loginData)
      setCookie('id', response.id, { expires: new Date(Date.now() + timeExp) })
      setCookie('role', roleMap.get(response.role), { expires: new Date(Date.now() + timeExp) })
      setCookie('info', response.info, { expires: new Date(Date.now() + timeExp) })
      router.push("/")
      router.refresh()
    }
    catch (error: any) {
      // setError("")
    }
  }

  return (
    <Box>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Вход
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Логин"
              name="login"
              autoComplete="username"
              value={loginData.login}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: "#1976d2",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }}
            >
              Войти
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
