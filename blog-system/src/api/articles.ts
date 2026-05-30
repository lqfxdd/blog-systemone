import apiClient from './index'
import type { Article } from '@/types'

// 获取文章列表（添加时间戳参数，避免浏览器/缓存数据未更新）
export const getArticles = (params?: any) => {
  const finalParams = { ...params, _t: Date.now() }
  return apiClient.get('/articles', { params: finalParams }).then(res => res.data)
}

export const getArticleById = (id: string) =>
  apiClient.get(`/articles/${id}`).then(res => res.data)

export const createArticle = (data: Partial<Article>) =>
  apiClient.post('/articles', data).then(res => res.data)

export const updateArticle = (id: string, data: Partial<Article>) =>
  apiClient.put(`/articles/${id}`, data).then(res => res.data)

export const deleteArticle = (id: string) =>
  apiClient.delete(`/articles/${id}`).then(res => res.data)