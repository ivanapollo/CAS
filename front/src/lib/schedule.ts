export interface Discipline {
  id: number
  name: string
  date_start: string
  date_end: string
}

export interface Lesson {
  discipline_id: number
  date: string
  time_end: string
  teacher_id: number
  subgroup: number
  id: number
  time_start: string
  group_id: number
  type: string
}

export interface Attendance {
  lesson_id: number
  student_id: number
  mark: string
}

export interface StudentInfo {
  student_id: number
  group_id: number
  subgroup: number
}

interface Class {
  number: number
  timeStart: string
  timeEnd: string
  subject: string
  type: string
  attendance: string | null
}

interface Day {
  date: string
  dayOfWeek: string
  isToday: boolean
  classes: Class[]
}

export interface Schedule {
  startDate: string
  endDate: string
  type: "числитель" | "знаменатель"
  days: Day[]
}

const markMap = new Map<string, string>([
  ["Был", "present"],
  ["Не был по уважительной причине", "absent-valid"],
  ["Не был по неуважительной причине", "absent-invalid"],
  ["Академический отпуск", "academic-leave"]
])

// Функция для преобразования даты в формат "DD.MM"
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  return `${day}.${month}`
}

// Функция для получения дня недели
const getDayOfWeek = (dateStr: string): string => {
  const days = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА']
  const date = new Date(dateStr)
  return days[date.getDay()]
}

// Функция для определения номера пары по времени
const getClassNumber = (timeStart: string): number => {
  const times = [
    '08:00', '09:45', '11:30', '13:30', '15:15', '17:00', '18:45',
  ]
  return times.indexOf(timeStart) + 1
}

// Основная функция
export const getStudentSchedule = (
  disciplines: Discipline[],
  lessons: Lesson[],
  attendances: Attendance[],
  studentInfo: StudentInfo,
  weekStartDate: Date,
): Schedule => {
  // Создаем словарь дисциплин для быстрого поиска по ID
  const disciplinesMap = new Map<number, string>()
  console.debug(disciplines)
  disciplines.forEach(discipline => {
    disciplinesMap.set(discipline.id, discipline.name)
  })

  // Фильтруем занятия для текущего студента
  const studentLessons = lessons.filter(lesson => 
    lesson.group_id === studentInfo.group_id && 
    (lesson.subgroup === studentInfo.subgroup || lesson.subgroup === 0)
  )

  // Создаем массив дней недели
  const days: Day[] = []
  const today = new Date().toISOString().split('T')[0]
 
  for (let i = 1; i <= 7; i++) {
    const currentDate = new Date(weekStartDate)
    currentDate.setDate(weekStartDate.getDate() + i)
    const dateStr = currentDate.toISOString().split('T')[0]
    const formattedDate = formatDate(dateStr)
  
    // Фильтруем занятия для текущего дня
    const dayLessons = studentLessons.filter(lesson => lesson.date === dateStr)
    
    // Сортируем занятия по времени начала
    dayLessons.sort((a, b) => a.time_start.localeCompare(b.time_start))
   
    // Формируем массив занятий для дня
    const classes: Class[] = dayLessons.map(lesson => {
      // Находим отметку о посещаемости
      const attendance = attendances.find(a => 
        a.lesson_id === lesson.id && a.student_id === studentInfo.student_id
      )

      // Получаем название дисциплины из словаря
      const subjectName = disciplinesMap.get(lesson.discipline_id) || ""

      // Преобразуем тип занятия
      const lessonType = lesson.type
      
      return {
        number: getClassNumber(lesson.time_start),
        timeStart: lesson.time_start,
        timeEnd: lesson.time_end,
        subject: subjectName,
        type: lessonType,
        attendance: attendance ? (markMap.get(attendance.mark) ?? null) : null
      }
    })
   
    days.push({
      date: formattedDate,
      dayOfWeek: getDayOfWeek(dateStr),
      isToday: dateStr === today,
      classes
    })
  }
  
  // Форматируем даты начала и конца недели
  const startDateStr = formatWeekDate(weekStartDate)
  const endDate = new Date(weekStartDate)
  endDate.setDate(weekStartDate.getDate() + 6)
  const endDateStr = formatWeekDate(endDate)
 
  const weekType = getWeekType(weekStartDate)

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    type: weekType,
    days
  }
}

// Вспомогательная функция для форматирования даты недели
const formatWeekDate = (date: Date): string => {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

// Возвращает день начала текущей недели
export function getStartOfWeek(date?: Date): Date {
  const currentDate = date ? new Date(date) : new Date()
  const resultDate = new Date(currentDate)
  
  const dayOfWeek = resultDate.getDay()
  const diffDays = dayOfWeek == 0 ? 6 : dayOfWeek - 1
  resultDate.setDate(resultDate.getDate() - diffDays)
  resultDate.setHours(0, 0, 0, 0)
  
  return resultDate
}

function getWeekWithOffset(date: Date, weeks: number = 1): Date {
  const startOfWeek = getStartOfWeek(date);
  const result = new Date(startOfWeek);
  result.setDate(startOfWeek.getDate() + (weeks * 7));
  return result;
}

// Возвращает день начала следующей недели
export function getNextWeek(date: Date): Date {
  return getWeekWithOffset(date, 1);
}

// Возвращает день начала предыдущей недели
export function getPrevWeek(date: Date): Date {
  return getWeekWithOffset(date, -1);
}

function getWeekType(date: Date): "числитель" | "знаменатель" {
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  const startOfYear = new Date(checkDate.getFullYear(), 0, 1)
  startOfYear.setHours(0, 0, 0, 0)
  
  const diffTime = checkDate.getTime() - startOfYear.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  const weekNumber = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7)
  
  return weekNumber % 2 === 0 ? "знаменатель" : "числитель"
}
