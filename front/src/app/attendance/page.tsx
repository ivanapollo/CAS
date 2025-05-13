'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Container, TextField, Typography, Autocomplete } from "@mui/material"
import ComboBox from "@/components/common/ComboBox"

export default function AttendancePage() {
  const HEIGHT = 250
  const MIN_HEIGHT = 30

  const options = ['Опция 1', 'Опция 2', 'Опция 3'];
  const params = [{ mr : 5, width : HEIGHT}];


  return (
    <Box>
      <Typography component="h3" variant="h6" align="left" gutterBottom>
        Просмотр посещаемости
      </Typography>

      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        
        <Box component="form"
          onSubmit={()=>{}}
          sx={{
            mt: 2,
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Autocomplete
            options={options}
            sx={{mr: 5, width: HEIGHT }}
            renderInput={(params) => <TextField {...params} label="Поле 1" variant="outlined" size="small" />}
            freeSolo
          />

          <Autocomplete
            options={options}
            sx={{mr: 5,  width: HEIGHT }}
            renderInput={(params) => <TextField {...params} label="Поле 1" variant="outlined" size="small" />}
            freeSolo
          />

          <Autocomplete
            options={options}
            sx={{mr: 5,  width: HEIGHT }}
            renderInput={(params) => <TextField {...params} label="Поле 1" variant="outlined" size="small" />}
            freeSolo
          />

          <Autocomplete
            options={options}
            sx={{mr: 10,  width: HEIGHT }}
            renderInput={(params) => <TextField {...params} label="Поле 1" variant="outlined" size="small" />}
            freeSolo
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            Применить
          </Button>
        </Box>

      </Container>
    </Box>
  )
}
