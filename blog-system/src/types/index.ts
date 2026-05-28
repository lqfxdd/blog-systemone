export interface Article {
  _id?: string          // MongoDB 真实 ID
  id?: string           // 兼容旧 Mock 数据
  title: string
  content: string
  excerpt?: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  author: string
  views: number
}

export interface User {
  _id?: string
  id?: string
  username: string
  password: string
  nickname: string
  avatar?: string
  role: string
}