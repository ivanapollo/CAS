"use client"

import { useEffect, useState } from "react"
import {
  Typography,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
} from "@mui/material"
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material"
import { lessonsAPI, attendanceAPI, disciplineAPI } from "@/lib/api"
import { getCookie } from "cookies-next/client"
import {
  type Discipline,
  type Lesson,
  type Attendance,
  type StudentInfo,
  type Schedule,
  getStudentSchedule,
  getStartOfWeek,
  getPrevWeek,
  getNextWeek
} from "@/lib/schedule"

export default function StudentCalendar() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek())
  const [schedule, setSchedule] = useState<Schedule>()
  const [flag, setFlag] = useState(false)
  const [studentData, setStudentData] = useState<StudentInfo>({
    student_id: parseInt(getCookie('id') as string),
    group_id: parseInt(getCookie('group_id') as string),
    subgroup: parseInt(getCookie('subgroup') as string),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _disciplines = await disciplineAPI.get()
        const _lessons = await lessonsAPI.get()
        const _attendance = await attendanceAPI.get()
        setDisciplines(_disciplines)
        setLessons(_lessons)
        setAttendance(_attendance)
        setFlag(true)
      }
      catch (error: any) {
        console.error(error)
      }
    }

    fetchData()
  },[]) 

  useEffect(() => {
    const data = getStudentSchedule(disciplines, lessons, attendance, studentData, currentWeek)
    setSchedule(data)
  },[flag, currentWeek])

  const navigateWeek = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentWeek((cur) => getPrevWeek(cur))
    }
    else {
      setCurrentWeek((cur) => getNextWeek(cur))
    }
  }

  const renderAttendanceStatus = (status: string | null) => {
    switch (status) {
      case "present":
        return (
          <TableCell
            sx={{
              bgcolor: "#4caf50",
              color: "white",
              width: "200px",
              textAlign: "center",
            }}
          />
        )
      case "absent-invalid":
        return (
          <TableCell
            sx={{
              bgcolor: "#f44336",
              color: "white",
              width: "200px",
              textAlign: "center",
            }}
          >
            По неуважительной причине
          </TableCell>
        )
      case "absent-valid":
        return (
          <TableCell
            sx={{
              bgcolor: "#f44336",
              color: "white",
              width: "200px",
              textAlign: "center",
            }}
          >
            По уважительной причине
          </TableCell>
        )
      case "academic-leave":
        return (
          <TableCell
            sx={{
              bgcolor: "#f44336",
              color: "white",
              width: "200px",
              textAlign: "center",
            }}
          >
            Академический отпуск
          </TableCell>
        )
      default:
        return <TableCell sx={{ width: "200px" }} />
    }
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigateWeek("prev")} sx={{ border: "1px solid #ccc" }}>
            <ChevronLeftIcon />
          </IconButton>
          {schedule && (
            <Typography variant="h6" sx={{ mx: 2 }}>
              {schedule.startDate} - {schedule.endDate}, {schedule.type}
            </Typography>
          )}
          <IconButton onClick={() => navigateWeek("next")} sx={{ border: "1px solid #ccc" }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {schedule && schedule.days.map((day, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Paper
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                p: 1.5,
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                borderBottomLeftRadius: day.classes.length === 0 ? "4px" : 0,
                borderBottomRightRadius: day.classes.length === 0 ? "4px" : 0,
              }}
            >
              <Typography variant="h6">
                {day.date} {day.dayOfWeek}
                {day.isToday ? " (СЕГОДНЯ)" : ""}
              </Typography>
            </Paper>

            {day.classes.length > 0 && (
              <TableContainer component={Paper} sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <Table>
                  <TableBody>
                    {day.classes.map((classItem, classIndex) => (
                      <TableRow key={classIndex}>
                        <TableCell sx={{ width: "50px", textAlign: "center" }}>{classItem.number}</TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          {classItem.timeStart && (
                            <>
                              {classItem.timeStart}
                              <br />
                              {classItem.timeEnd}
                            </>
                          )}
                        </TableCell>
                        <TableCell>{classItem.subject}</TableCell>
                        <TableCell sx={{ width: "200px" }}>{classItem.type}</TableCell>
                        {renderAttendanceStatus(classItem.attendance)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ))}
      </Container>
    </Box>
  )
}
