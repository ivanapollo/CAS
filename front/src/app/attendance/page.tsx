'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Container, TextField, Typography, Autocomplete } from "@mui/material"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { Discipline } from "@/lib/schedule"
import { getCookie } from "cookies-next/client"

import { disciplinesTypesAPI, groupsByDisciplineAPI, subgroupByGroupAndTypeAPI, teacherDisciplinesAPI } from "@/lib/api"

export default function AttendancePage() {
  const WIDTH = 250

  const options = ['Опция 1', 'Опция 2', 'Опция 3'];

  const [teacher_id, setTeacher_id] = useState<string>(parseInt(getCookie('id')))
  const [discipline_id, setDiscipline] = useState<string>("")
  const [cur_type, setCurType] = useState<string>("")
  const [cur_group, setCurGroup] = useState<string>("")
  const [cur_subgroup, setCursubgroup] = useState<string>("")

  const [disciplines, setDisciplines] = useState([])
  const [lesson_types, setLesson_types] = useState([])
  const [groups, setGroups] = useState([])
  const [subgroups, setSubgroups] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _disciplines = await teacherDisciplinesAPI.get(teacher_id)
        setDisciplines(_disciplines)
      }
      catch (error: any) {
        console.error(error)
      }
    }

    fetchData()
  },[]) 

  const handleChangeDiscipline = async (e : React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setDiscipline(e.target.value)

    setLesson_types([])
    setGroups([])
    setSubgroups([])
    setCurType("")
    setCurGroup("")
    setCursubgroup("")

    try {
      const response = await disciplinesTypesAPI.get(e.target.value);
      const data = await response; // предполагается, что API возвращает JSON

      setLesson_types(data); // сохраняем полученные типы в состояние
    } catch (error) {
      console.error("Ошибка при загрузке типов дисциплин:", error);
    }
  }

  const handleChangeType = async (e : React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setCurType(e.target.value)
    setGroups([])
    setSubgroups([])
    setCurGroup("")
    setCursubgroup("")

    try {
      const response = await groupsByDisciplineAPI.get(teacher_id, discipline_id, e.target.value);
      const data = await response; // предполагается, что API возвращает JSON

      setGroups(data); // сохраняем полученные типы в состояние
    } catch (error) {
      console.error("Ошибка при загрузке типов дисциплин:", error);
    }
  }

  const handleChangeGroup = async (e : React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setCurGroup(e.target.value)
    setSubgroups([])
    setCursubgroup("")

    try {
      const response = await subgroupByGroupAndTypeAPI.get(e.target.value, teacher_id, discipline_id, cur_type);
      const data = await response; // предполагается, что API возвращает JSON
      console.log(data)

      setSubgroups(data); // сохраняем полученные типы в состояние
    } catch (error) {
      console.error("Ошибка при загрузке типов дисциплин:", error);
    }
  }

  const isButtonDisabled = 
    (discipline_id === "") || (cur_type === "") || (cur_group === "") || (cur_subgroup === "") 

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

          <TextField
            label="Предмет"
            size="small"
            sx={{mr : 5, width : WIDTH}}
            onChange={handleChangeDiscipline}
            value={discipline_id}
            select
            >
            {disciplines.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            label="Тип занятия"
            size="small"
            sx={{mr : 5, width : WIDTH}}
            onChange={handleChangeType}
            value={cur_type}
            select
            >
            {lesson_types.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            label="Группа"
            size="small"
            sx={{mr : 5, width : WIDTH}}
            onChange={handleChangeGroup}
            value={cur_group}
            select
            >
            {groups.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            label="Подгруппа"
            size="small"
            sx={{mr : 5, width : WIDTH}}
            onChange={(e : React.ChangeEvent<HTMLSelectElement>) => {setCursubgroup(e.target.value)}}
            value={cur_subgroup}
            select
            >
            {subgroups.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isButtonDisabled}
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
