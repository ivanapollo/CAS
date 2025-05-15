"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Typography,
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material"
import { disciplineAPI, groupsAPI, subgroupsAPI, usersAPI, electivesAPI } from "@/lib/api"

interface Student {
  name: string
  isAttending: boolean
}

interface Group {
  id: number
  name: string
}

interface Discipline {
  id: number
  name: string
  date_start: string
  date_end: string
}

interface User {
  id: number
  patronymic: string
  login: string
  name: string
  surname: string
  role: string
  password: string
}

interface Elective {
  discipline_id: number
  student_id: number
}

function getStudentsWithElectiveStatus(
  groupStructure: Record<string, string[]>,
  users: User[],
  electives: Elective[],
  discipline_id: number
): Student[] {
  const nameToUserMap: Record<string, User> = {}
  users.forEach(user => {
    const fullName = `${user.surname} ${user.name} ${user.patronymic}`
    nameToUserMap[fullName] = user
  })

  const attendingStudentIds = new Set(
    electives
      .filter(elective => elective.discipline_id === discipline_id)
      .map(elective => elective.student_id)
  )

  const result: Student[] = []

  for (const subgroup in groupStructure) {
    const studentsInSubgroup = groupStructure[subgroup]
    studentsInSubgroup.forEach(fullName => {
      const user = nameToUserMap[fullName]
      if (user) {
        result.push({
          name: fullName,
          isAttending: attendingStudentIds.has(user.id)
        })
      } else {
        result.push({
          name: fullName,
          isAttending: false
        })
      }
    })
  }

  return result
}

export default function ElectivesPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [selectedGroup, setSelectedGroup] = useState<number>()
  const [selectedDiscipline, setSelectedDiscipline] = useState<number>()
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _groups = await groupsAPI.get()
        const _disciplines = await disciplineAPI.get()
        setGroups(_groups)
        setDisciplines(_disciplines)
      }
      catch (error: any) {
        console.error(error)
      }
    }

    fetchData()
  },[]) 

  const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGroup(parseInt(event.target.value))
  }
  
  const handleDisciplineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDiscipline(parseInt(event.target.value))
  }

  const handleApply = async () => {
    if (!selectedGroup || !selectedDiscipline) return

    try {
      const _subgroups = await subgroupsAPI.get(selectedGroup)
      const _users = await usersAPI.get()
      const _electives = await electivesAPI.get()
      console.debug(_subgroups, _users, _electives)
      const data = getStudentsWithElectiveStatus(_subgroups, _users, _electives, selectedDiscipline)
      setStudents(data)
      setFilteredStudents(data)
      setIsApplied(true)
      setSearchQuery("")
    }
    catch (error: any) {
      console.error(error)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleResetSearch = () => {
    setSearchQuery("")
    setFilteredStudents(students)
  }

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredStudents(filtered)
    }
  }

  const handleToggle = (name: string) => {
    const updatedStudents = students.map((student) =>
      student.name === name ? { ...student, isAttending: !student.isAttending } : student,
    )
    setStudents(updatedStudents)

    const updatedFiltered = filteredStudents.map((student) =>
      student.name === name ? { ...student, isAttending: !student.isAttending } : student,
    )
    setFilteredStudents(updatedFiltered)
  }

  const handleSave = () => {
    console.log("Сохранение данных:", students)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Предметы по выбору
        </Typography>

        <Box sx={{mt: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Предмет по выбору</InputLabel>
            <Select
              label="Предмет по выбору"
              value={selectedDiscipline ?? ""}
              onChange={handleDisciplineChange}
              sx={{
                minWidth: 300
              }}
            >
              {disciplines.map((discipline) => (
                  <MenuItem key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

         <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Группа</InputLabel>
            <Select
              label="Группа"
              value={selectedGroup ?? ""}
              onChange={handleGroupChange}
              sx={{
                minWidth: 300
              }}
            >
              {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleApply} disabled={!selectedGroup} sx={{ height: 40 }}>
            Применить
          </Button>
        </Box>

        {isApplied && (
          <Box maxWidth="md" margin="auto">
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl sx={{ flexGrow: 1 }}>
                <TextField label="Поиск" placeholder="ФИО" value={searchQuery} onChange={handleSearchChange} fullWidth />
              </FormControl>

              <Button variant="outlined" onClick={handleResetSearch} sx={{ height: 40 }}>
                Сбросить
              </Button>

              <Button variant="contained" onClick={handleSearch} sx={{ height: 40 }}>
                Найти
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="10%">№</TableCell>
                    <TableCell width="70%">ФИО</TableCell>
                    <TableCell width="20%" align="center">
                      Посещает предмет
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={student.isAttending}
                          onChange={() => handleToggle(student.name)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Данные не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
              <Button variant="contained" onClick={handleSave} disabled={filteredStudents.length === 0}>
                Сохранить
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}
