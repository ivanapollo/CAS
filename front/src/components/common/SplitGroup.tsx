"use client"

import { useState, useEffect } from "react"
import {
  Typography,
  Button,
  Container,
  Box,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  type SelectChangeEvent,
} from "@mui/material"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface Student {
  name: string
  subgroup: number
}

interface SplitGroupProps {
  setEdit: (edit: boolean) => void
  initialStudents: Student[]
}

export default function SplitGroup( { setEdit, initialStudents } : SplitGroupProps ) {
  const [isChosen, setIsChosen] = useState(false)
  const [current, setCurrent] = useState(1)
  const [subgroupCount, setSubgroupCount] = useState<number>(1)
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [subgroups, setSubgroups] = useState<Record<number, Student[]>>({})

  useEffect(() => {
    const initialSubgroups: Record<number, Student[]> = {}

    for (let i = 1; i <= subgroupCount; i++) {
      initialSubgroups[i] = []
    }

    students.forEach((student) => {
      initialSubgroups[1].push({ ...student, subgroup: 1 })
    })

    setSubgroups(initialSubgroups)
  }, [subgroupCount, students])

  const handleSubgroupCountChange = () => {
    setStudents(initialStudents)
    setSubgroupCount(current)
    setIsChosen(true)
  }

  const handleSelect = (event: SelectChangeEvent<number>) => {
    setCurrent(Number(event.target.value))
  }

  const handleBack = () => {
    setEdit(false)
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceSubgroupId = Number(source.droppableId)
    const destSubgroupId = Number(destination.droppableId)

    const newSubgroups = { ...subgroups }
    const [movedStudent] = newSubgroups[sourceSubgroupId].splice(source.index, 1)
    movedStudent.subgroup = destSubgroupId
    newSubgroups[destSubgroupId].splice(destination.index, 0, movedStudent)

    setSubgroups(newSubgroups)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography>Количество подгрупп:</Typography>
          <FormControl sx={{ minWidth: 80 }}>
            <Select value={current} onChange={handleSelect}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleSubgroupCountChange} sx={{ ml: 2 }}>
            Выбрать
          </Button>

          <Button variant="outlined" onClick={handleBack}>
            Назад
          </Button>
        </Box>

        {isChosen && <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {Object.entries(subgroups).map(([subgroupId, studentsInSubgroup]) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={subgroupId}>
                  <Card sx={{ backgroundColor: "#f5f5f5" }}>
                    <CardHeader
                      title={`Подгруппа ${subgroupId}`}
                      slotProps={{
                        title: { variant: "h6" }
                      }}
                      sx={{ backgroundColor: "#e3f2fd", py: 1 }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      <Droppable droppableId={subgroupId}>
                        {(provided) => (
                          <List {...provided.droppableProps} ref={provided.innerRef} sx={{ minHeight: 200, p: 0 }}>
                            {studentsInSubgroup.map((student, index) => (
                              <Draggable key={student.name} draggableId={student.name} index={index}>
                                {(provided) => (
                                  <ListItem
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    divider
                                    sx={{
                                      backgroundColor: "white",
                                      "&:hover": { backgroundColor: "#f9f9f9" },
                                    }}
                                  >
                                    <ListItemText primary={student.name} />
                                  </ListItem>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </List>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DragDropContext>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
            <Button variant="contained" onClick={handleBack}>
              Сохранить
            </Button>
          </Box>
        </>}
      </Container>
    </Box>
  )
}
