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
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material"
import { groupsAPI, subgroupsAPI } from "@/lib/api"
import SplitGroup from "@/components/common/SplitGroup"

interface Group {
  id: number
  name: string
}

interface GroupStructure {
  [subgroup: string]: string[]
}

interface Student {
  name: string
  subgroup: number
}

function transformToStudents(groupStructure: GroupStructure): Student[] {
  const students: Student[] = []
  
  for (const subgroup in groupStructure) {
    const subgroupNumber = parseInt(subgroup)
    
    groupStructure[subgroup].forEach(fullName => {
      students.push({
        name: fullName,
        subgroup: subgroupNumber
      })
    })
  }
  
  return students
}
export default function SubgroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<number>()
  const [numberOfSubgroups, setNumberOfSubgroups] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isApplied, setIsApplied] = useState(false)
  const [edit, setEdit] = useState(false)

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
      const data = transformToStudents(_subgroups)
      const cnt = Math.max(1, Math.max(...Object.keys(_subgroups).map(Number)))
      setStudents(data)
      setNumberOfSubgroups(cnt)
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const value = parseInt(event.target.value)
    setStudents(prev => 
      prev.map(student => 
        student.name === name 
          ? { ...student, subgroup: value } 
          : student
      )
    )
  
    setFilteredStudents(prev => 
      prev.map(student => 
        student.name === name 
          ? { ...student, subgroup: value } 
          : student
      )
    )
  }

  const handleSave = () => {
    console.log("Сохранение данных:", students)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Подгруппы
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
              disabled={edit}
            >
              {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleApply} disabled={!selectedGroup || edit} sx={{ height: 40 }}>
            Применить
          </Button>
        </Box>

        {!edit && isApplied && (
          <Box maxWidth="md" margin="auto">
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Количество подгрупп: {numberOfSubgroups}</Typography>
              <Button variant="contained" sx={{ height: 40 }} onClick={() => setEdit(true)}>
                Разбить на подгруппы
              </Button>
            </Box>

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
                      Номер подгруппы
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <FormControl fullWidth sx={{ minWidth: 120, marginTop: 2, alignItems: "center" }}>
                          <Select
                            variant="standard"
                            value={student.subgroup}
                            onChange={(e) => handleChange(e, student.name)}
                            sx={{
                              maxWidth: "100px",
                              maxHeight: "20px",
                            }}
                          >
                            {Array.from({ length: numberOfSubgroups }, (_, i) => i + 1).map((number) => (
                              <MenuItem key={number} value={number}>
                                {number}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
        {edit && <SplitGroup setEdit={setEdit} initialStudents={students}/>}
      </Container>
    </Box>
  )
}
