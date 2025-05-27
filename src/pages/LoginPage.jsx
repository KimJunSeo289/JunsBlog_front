import { useEffect, useState } from 'react'
import css from './registerpage.module.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'
import KakaoLoginButton from '../components/KakaoLoginButton'
import Modal from '../components/Modal'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')

  const [redirect, setRedirect] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('알림')
  const [modalContent, setModalContent] = useState('')
  const [onlyConfirm, setOnlyConfirm] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateUsername = value => {
    if (!value) {
      setErrUsername('')
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
      setErrUsername('사용자명은 영문자로 시작하는 4자 이상의 영문자 또는 숫자여야 합니다.')
    } else {
      setErrUsername('')
    }
  }

  const validatePassword = value => {
    if (!value) {
      setErrPassword('')
      return
    }
    if (value.length < 4) {
      setErrPassword('패스워드는 4자 이상이어야 합니다.')
    } else {
      setErrPassword('')
    }
  }
  const handleUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
    validateUsername(value)
  }
  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const closeModal = () => {
    setModalOpen(false)
    if (modalTitle === '로그인 성공') {
      navigate('/')
    }
  }

  const login = async e => {
    e.preventDefault()

    validateUsername(username)
    validatePassword(password)
    if (errUsername || errPassword || !username || !password) {
      setModalTitle('입력 오류')
      setModalContent('아이디와 패스워드를 확인하세요.')
      setOnlyConfirm(true)
      setModalOpen(true)
      return
    }

    try {
      const userData = await loginUser({ username, password })
      if (userData) {
        setModalTitle('로그인 성공')
        setModalContent('환영합니다!')
        setOnlyConfirm(true)
        setModalOpen(true)
        dispatch(setUserInfo(userData))
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status
        if (status === 404) {
          setModalTitle('로그인 실패')
          setModalContent('존재하지 않는 계정입니다.')
        } else if (status === 401) {
          setModalTitle('로그인 실패')
          setModalContent('아이디 혹은 비밀번호가 틀렸습니다.')
        } else {
          setModalTitle('로그인 실패')
          setModalContent('로그인에 실패했습니다.')
        }
      } else {
        setModalTitle('오류')
        setModalContent('네트워크 오류가 발생했습니다.')
      }
      setOnlyConfirm(true)
      setModalOpen(true)
    }
  }

  useEffect(() => {
    if (redirect) {
      navigate('/')
    }
  }, [redirect, navigate])

  return (
    <main className={css.loginpage}>
      <h2>로그인 페이지</h2>
      <form className={css.container} onSubmit={login}>
        <input value={username} onChange={handleUsernameChange} type="text" placeholder="아이디" />
        <strong>{errUsername}</strong>

        <input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          placeholder="패스워드"
        />
        <strong>{errPassword}</strong>

        <button type="submit">로그인</button>
      </form>

      <div className={css.socialLogin}>
        <p>소셜 계정으로 로그인</p>
        <KakaoLoginButton />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
        onlyConfirm={onlyConfirm}
        confirmText="확인"
        onConfirm={closeModal}
        onCancel={closeModal}
      />
    </main>
  )
}
