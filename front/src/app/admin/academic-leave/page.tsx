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
import { groupsAPI, academicLeaveAPI, subgroupsAPI } from "@/lib/api"

interface Student {
  name: string
  isLeave: boolean
}

interface GroupStructure {
  [subgroup: string]: string[]
}

interface Group {
  id: number
  name: string
}

function transformStudents(studentLeave: string[], groupStructure: GroupStructure): Student[] {
  const leaveStudents = new Set(studentLeave)

  const allStudents: Student[] = []
  
  for (const subgroup in groupStructure) {
    const studentsInSubgroup = groupStructure[subgroup]
    
    studentsInSubgroup.forEach(fullName => {
      allStudents.push({
        name: fullName,
        isLeave: leaveStudents.has(fullName)
      })
    })
  }

  return allStudents
}

export default function AcademicLeavePage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<number>()
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _groups = await groupsAPI.get()
        setGroups(_groups)
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
 
  const handleApply = async () => {
    if (!selectedGroup) return

    try {
      const _subgroups = await subgroupsAPI.get(selectedGroup)
      const _studentsLeave = await academicLeaveAPI.get(selectedGroup)

      const data = transformStudents(_studentsLeave, _subgroups)
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
      student.name === name ? { ...student, isLeave: !student.isLeave } : student,
    )
    setStudents(updatedStudents)

    const updatedFiltered = filteredStudents.map((student) =>
      student.name === name ? { ...student, isLeave: !student.isLeave } : student,
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
          Академический отпуск
        </Typography>

        <Box sx={{mt: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
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
                      Академический отпуск
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
                          checked={student.isLeave}
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
