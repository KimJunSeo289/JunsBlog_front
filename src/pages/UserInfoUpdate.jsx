import { useEffect, useState } from 'react'
import css from './userinfoupdate.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, updateUserInfo } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'

export const UserInfoUpdate = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user?.user)
  const isAuthChecked = useSelector(state => state.user?.isAuthChecked)

  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate('/login', { replace: true })
    }
  }, [isAuthChecked, user, navigate])

  if (!isAuthChecked) {
    return <div>로그인 상태를 확인 중입니다...</div>
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = e => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    if (password) {
      if (password.length < 4) {
        setError('비밀번호는 최소 4자 이상이어야 합니다.')
        return
      }

      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }
    }

    try {
      setLoading(true)

      const userData = {
        password: password || undefined,
      }

      await updateUserInfo(userData)

      const updatedProfile = await getUserProfile()
      dispatch(setUserInfo(updatedProfile))

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        setSuccess(false)
        navigate(`/mypage/${user.username}`)
      }, 1000)
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error)
      setError(error.response?.data?.error || '사용자 정보 업데이트에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(`/mypage/${user.username}`)
  }

  if (!user) return null

  return (
    <main className={css.userinfoupdate}>
      <h2>내 정보 수정</h2>

      <form onSubmit={handleSubmit} className={css.updateForm}>
        <div className={css.formGroup}>
          <label htmlFor="username">사용자 이름</label>
          <input
            type="text"
            id="username"
            value={user.username || ''}
            disabled
            className={css.disabledInput}
          />
          <p className={css.helperText}>사용자 이름은 변경할 수 없습니다.</p>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="변경할 비밀번호를 입력하세요"
            className={css.input}
          />
          <p className={css.helperText}>
            비밀번호는 최소 4자 이상이어야 합니다. 변경하지 않으려면 비워두세요.
          </p>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호 확인"
            className={css.input}
          />
        </div>

        {error && <div className={css.errorMessage}>{error}</div>}
        {success && (
          <div className={css.successMessage}>사용자 정보가 성공적으로 업데이트되었습니다.</div>
        )}

        <div className={css.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={css.cancelButton}
            disabled={loading}
          >
            취소
          </button>
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? '처리 중...' : '저장'}
          </button>
        </div>
      </form>
    </main>
  )
}
