import apiClient from './index'

export const login = (username: string, password: string) =>
  apiClient.post('/auth/login', { username, password }).then(res => res.data)

export const register = (username: string, password: string, nickname?: string) =>
  apiClient.post('/auth/register', { username, password, nickname }).then(res => res.data)

export const getCurrentUser = () =>
  apiClient.get('/auth/me').then(res => res.data)