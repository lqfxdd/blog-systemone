import apiClient from './index'

export const getCategories = () =>
  apiClient.get('/categories').then(res => res.data)

export const addCategory = (name: string) =>
  apiClient.post('/categories', { name }).then(res => res.data)

export const updateCategory = (oldName: string, newName: string) =>
  apiClient.put(`/categories/${encodeURIComponent(oldName)}`, { newName }).then(res => res.data)

export const deleteCategory = (name: string) =>
  apiClient.delete(`/categories/${encodeURIComponent(name)}`).then(res => res.data)