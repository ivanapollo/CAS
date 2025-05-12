"use client"

import "./globals.css"
import { Roboto } from "next/font/google"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import BaseLayout from "@/components/layout/BaseLayout"
import StudentLayout from "@/components/layout/StudentLayout"
import TeacherLayout from "@/components/layout/TeacherLayout"
import AdminLayout from "@/components/layout/AdminLayout"
import { getCookie } from "cookies-next/client"

const font = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const theme = createTheme()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const role = getCookie("role")

  return (
    <html lang="ru">
      <body className={`${font.variable} antialiased`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!role && <BaseLayout>{children}</BaseLayout>}
          {role === "student" && <StudentLayout>{children}</StudentLayout>}
          {role === "teacher" && <TeacherLayout>{children}</TeacherLayout>}
          {role === "admin" && <AdminLayout>{children}</AdminLayout>}
        </ThemeProvider>
      </body>
    </html>
  )
}
