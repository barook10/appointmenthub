import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  sessionStorage.setItem('token', data.token)
  return { token: data.token, user: data.user }
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password })
  return { user: data.user }
}

export function verifyToken(token) {
  // Token verification is handled by backend
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
