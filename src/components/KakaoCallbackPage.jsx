import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../store/userSlice'

const API_URL = import.meta.env.VITE_BACK_URL

export const KakaoCallbackPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchKakaoUser = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      try {
        const res = await axios.get(`${API_URL}/auth/kakao/callback?code=${code}`, {
          withCredentials: true,
        })
        dispatch(setUserInfo(res.data))
        navigate('/')
      } catch (err) {
        console.error('카카오 로그인 실패:', err)
        navigate('/login')
      }
    }
    fetchKakaoUser()
  }, [navigate, dispatch])

  return <div>카카오 로그인 처리 중...</div>
}
