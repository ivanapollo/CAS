import type { Login } from "@/lib/types"

// URL API
const API_URL = "http://localhost:8000"

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

// API для получения занятий
export const disciplineAPI = {
  get: async () => {
    return fetchAPI("/disciplines", {
      method: "GET",
    })
  },
}
