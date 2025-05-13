import type { Login } from "@/lib/types"

// URL API
const API_URL = "http://localhost:3005"

// Общая функция для выполнения запросов
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail[0].msg || data.detail || "Произошла ошибка при выполнении запроса")
  }

  return data
}

// API для аутентификации
export const loginAPI = {
  login: async (loginData: Login) => {
    return fetchAPI("/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    })
  },
}

// API для получения посещаемости
export const attendanceAPI = {
  get: async () => {
    return fetchAPI("/attendances", {
      method: "GET",
    })
  },
}

// API для получения занятий
export const lessonsAPI = {
  get: async () => {
    return fetchAPI("/lessons", {
      method: "GET",
    })
  },
}

// API для получения предметов
export const disciplineAPI = {
  get: async () => {
    return fetchAPI("/disciplines", {
      method: "GET",
    })
  },
}

// API для получения групп
export const groupsAPI = {
  get: async () => {
    return fetchAPI("/groups", {
      method: "GET",
    })
  },
}

// API для получения старост
export const headmenAPI = {
  get: async (group_id: number) => {
    return fetchAPI(`/api/student_data/groups/${group_id}/headmen/`, {
      method: "GET",
    })
  },
}

// API для получения подгрупп
export const subgroupsAPI = {
  get: async (group_id: number) => {
    return fetchAPI(`/api/student_data/groups/${group_id}/subgroups/`, {
      method: "GET",
    })
  },
}

// API для получения студентов в академическом отпуске
export const academicLeaveAPI = {
  get: async (group_id: number) => {
    return fetchAPI(`/api/student_data/groups/${group_id}/academic-leave/students/`, {
      method: "GET",
    })
  },
}


export const teacherDisciplinesAPI = {
  get: async (teacher_id: number) => {
    return fetchAPI(`/api/attendance/teachers/${teacher_id}/disciplines/`, {
      method: "GET",
    })
  },
}

export const disciplinesTypesAPI = {
  get: async (discipline_id: number) => {
    return fetchAPI(`/api/attendance/lessons/${discipline_id}/types/`, {
      method: "GET",
    })
  },
}

export const groupsByDisciplineAPI = {
  get: async (teacher_id: number, discipline_id: number, lesson_type: string) => {
    // Формируем query параметры
    const params = new URLSearchParams({
      teacher_id: teacher_id.toString(),
      discipline_id: discipline_id.toString(),
      lesson_type: lesson_type,
    });

    const response = await fetchAPI(`/api/attendance/groups/filter?${params.toString()}`, {
      method: "GET",
    });

    return response;
  },
};

export const subgroupByGroupAndTypeAPI = {
  get: async (group_id : number, teacher_id: number, discipline_id: number, lesson_type: string) => {
    // Формируем query параметры
    const params = new URLSearchParams({
      teacher_id: teacher_id.toString(),
      discipline_id: discipline_id.toString(),
      lesson_type: lesson_type,
    });

    return fetchAPI(`/api/attendance/groups/${group_id}/subgroups/?${params.toString()}`, {
      method: "GET",
    })
  },
}