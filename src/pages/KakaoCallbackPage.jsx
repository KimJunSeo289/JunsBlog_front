import { useEffect } from 'react'

const API_URL = import.meta.env.VITE_BACK_URL

export const KakaoCallbackPage = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      alert('로그인 코드가 없습니다.')
      return
    }

    window.location.href = `${API_URL}/auth/kakao/callback?code=${code}`
  }, [])

  return <div>카카오 로그인 처리 중입니다...</div>
}
