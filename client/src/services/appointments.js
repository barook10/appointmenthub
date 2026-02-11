import api from './api'

export async function getAppointments() {
  const { data } = await api.get('/appointments')
  return data.appointments
}

export async function getAppointment(id) {
  const { data } = await api.get(`/appointments/${id}`)
  return data.appointment
}

export async function createAppointment(userId, appointmentData) {
  const { data } = await api.post('/appointments', appointmentData)
  return data.appointment
}

export async function updateAppointment(id, patch) {
  const { data } = await api.put(`/appointments/${id}`, patch)
  return data.appointment
}

export async function deleteAppointment(id) {
  await api.delete(`/appointments/${id}`)
}

export async function getStats() {
  const { data } = await api.get('/admin/stats')
  return data.stats
}

export async function getAuditLogs(filter) {
  const params = filter && filter !== 'all' ? { action: filter } : {}
  const { data } = await api.get('/admin/audit', { params })
  return data.logs
}

// Email simulation (no-op on frontend since backend handles it)
export const getEmailLog = () => []
