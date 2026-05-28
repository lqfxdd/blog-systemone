import apiClient from './index'
import type { Article } from '@/types'

export const getArticles = (params?: any) =>
  apiClient.get('/articles', { params }).then(res => res.data)

export const getArticleById = (id: string) =>
  apiClient.get(`/articles/${id}`).then(res => res.data)

export const createArticle = (data: Partial<Article>) =>
  apiClient.post('/articles', data).then(res => res.data)

export const updateArticle = (id: string, data: Partial<Article>) =>
  apiClient.put(`/articles/${id}`, data).then(res => res.data)

export const deleteArticle = (id: string) =>
  apiClient.delete(`/articles/${id}`).then(res => res.data)