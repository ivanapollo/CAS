import type React from "react"

import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Container from "@mui/material/Container"
import AppBar from "@/components/common/AppBar"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar role="student"/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}
