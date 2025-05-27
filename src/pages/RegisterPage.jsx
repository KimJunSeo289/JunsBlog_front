import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../apis/userApi'
import Modal from '../components/Modal'
import css from './registerpage.module.css'
import KakaoLoginButton from '../components/KakaoLoginButton'

export const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordOk, setPasswordOk] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPasswordOk, setErrPasswordOk] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalOnlyConfirm, setModalOnlyConfirm] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const validatePasswordCheck = (value, current = password) => {
    if (!value) {
      setErrPasswordOk('')
      return
    }
    if (value !== current) {
      setErrPasswordOk('패스워드가 일치하지 않습니다.')
    } else {
      setErrPasswordOk('')
    }
  }

  const handleUsernameChange = e => {
    const v = e.target.value
    setUsername(v)
    validateUsername(v)
  }
  const handlePasswordChange = e => {
    const v = e.target.value
    setPassword(v)
    validatePassword(v)
  }
  const handlePasswordOkChange = e => {
    const v = e.target.value
    setPasswordOk(v)
    validatePasswordCheck(v, password)
  }

  const closeModal = () => {
    setModalOpen(false)
    if (modalTitle === '회원가입 성공') {
      navigate('/login')
    }
  }

  const register = async e => {
    e.preventDefault()
    validateUsername(username)
    validatePassword(password)
    validatePasswordCheck(passwordOk, password)

    if (errUsername || errPassword || errPasswordOk || !username || !password || !passwordOk) {
      setModalTitle('입력 오류')
      setModalContent('모든 항목을 올바르게 입력해주세요.')
      setModalOnlyConfirm(true)
      setModalOpen(true)
      return
    }

    try {
      setIsSubmitting(true)
      await registerUser({ username, password })
      setModalTitle('회원가입 성공')
      setModalContent('회원가입이 완료되었습니다.')
      setModalOnlyConfirm(true)
      setModalOpen(true)
    } catch (err) {
      console.error(err.response?.data || err)
      setModalTitle('회원가입 실패')
      setModalContent(
        err.response?.data?.message ||
          '중복되는 이메일 혹은 알 수 없는 오류로 회원가입에 실패하였습니다.'
      )
      setModalOnlyConfirm(true)
      setModalOpen(true)
      setIsSubmitting(false)
    }
  }

  return (
    <main className={css.registerpage}>
      <h2>회원가입 페이지</h2>
      <form className={css.container} onSubmit={register}>
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={handleUsernameChange}
        />
        <strong>{errUsername}</strong>

        <input
          type="password"
          placeholder="패스워드"
          value={password}
          onChange={handlePasswordChange}
        />
        <strong>{errPassword}</strong>

        <input
          type="password"
          placeholder="패스워드 확인"
          value={passwordOk}
          onChange={handlePasswordOkChange}
        />
        <strong>{errPasswordOk}</strong>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록중...' : '가입하기'}
        </button>
      </form>

      <div className={css.socialLogin}>
        <p>소셜 계정으로 회원가입</p>
        <KakaoLoginButton />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
        onlyConfirm={modalOnlyConfirm}
        confirmText="확인"
        onConfirm={closeModal}
      />
    </main>
  )
}
