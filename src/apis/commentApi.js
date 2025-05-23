import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

// 댓글 작성 API
export const createComment = async commentData => {
  const response = await axios.post(`${API_URL}/comments`, commentData)
  return response.data
}

export const getComments = async postId => {
  const response = await axios.get(`${API_URL}/comments/${postId}`)
  return response.data
}

export const updateComment = async (commentId, content) => {
  const response = await axios.put(`${API_URL}/comments/${commentId}`, { content })
  return response.data
}
