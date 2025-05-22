import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

// axios는 자동으로 headers를 포함한다.
// export const createPost = async postData => {
//   const responce = await axios.post(`${API_URL}/postWrite`, postData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   })
//   return responce.data
// }
export const createPost = async postData => {
  const responce = await axios.post(`${API_URL}/postWrite`, postData)
  return responce.data
}

export const getPostList = async (page = 0, limit = 3) => {
  const response = await axios.get(`${API_URL}/postList`, {
    params: { page, limit },
  })
  return response.data
}
