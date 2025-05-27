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
    const handleKakaoLogin = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (!code) {
        alert('로그인 코드가 없습니다.')
        return
      }

      try {
        const res = await axios.get(`${API_URL}/auth/kakao/callback?code=${code}`, {
          withCredentials: true,
        })
        dispatch(setUserInfo(res.data))
        navigate('/')
      } catch (err) {
        console.error('카카오 로그인 실패:', err)
        alert('카카오 로그인 실패')
        navigate('/login')
      }
    }

    handleKakaoLogin()
  }, [navigate, dispatch])

  return <div>카카오 로그인 처리 중입니다...</div>
}
