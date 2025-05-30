import { Link, NavLink } from 'react-router-dom'
import css from './header.module.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'
import ReactModal from 'react-modal'
import Modal from './Modal'

export const Header = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const username = user?.username
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await getUserProfile()
        if (userData) {
          dispatch(setUserInfo(userData))
        }
      } catch (err) {
        console.log(err)
        dispatch(setUserInfo(''))
      } finally {
        setIsLoading(false)
      }
    }
    getProfile()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(setUserInfo(''))
      setIsMenuActive(false)
      setLogoutModalOpen(false)
    } catch (err) {
      console.log('프로필 조회 실패:', err)
      dispatch(setUserInfo(''))
    }
  }

  if (isLoading) {
    return (
      <header className={css.header}>
        <h1>
          <Link to={'/'}>TOKTOKLOG</Link>
        </h1>
        <div>로딩 중...</div>
      </header>
    )
  }
  const toggleMenu = () => {
    setIsMenuActive(prev => !prev)
  }
  const closeMenu = () => {
    setIsMenuActive(false)
  }

  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      closeMenu()
    }
  }

  const handleGnbClick = e => {
    e.stopPropagation()
  }

  return (
    <header className={css.header}>
      <h1>
        <Link to={'/'}>Jun's Blog</Link>
      </h1>
      <p className={css.name}>{username}</p>
      <Hamburger isMenuActive={isMenuActive} toggleMenu={toggleMenu} />
      <nav className={css.gnbCon} onClick={handleBackgroundClick}>
        <div className={css.gnb} onClick={handleGnbClick}>
          {username ? (
            <div className={css.gnbContent}>
              <MenuLike to="/createPost" label="글쓰기" closeMenu={closeMenu} />
              <MenuLike to={`/mypage/${username}`} label="내정보" closeMenu={closeMenu}>
                내 정보
              </MenuLike>
              <button onClick={() => setLogoutModalOpen(true)}>로그아웃</button>

              <Modal
                isOpen={isLogoutModalOpen}
                onRequestClose={() => setLogoutModalOpen(false)}
                title="로그아웃"
                content="로그아웃 하시겠습니까?"
                confirmText="예"
                cancelText="아니오"
                onConfirm={handleLogout}
                onCancel={() => setLogoutModalOpen(false)}
              />
            </div>
          ) : (
            <>
              <div className={css.gnbContent}>
                <MenuLike to="/register" label="회원가입" closeMenu={closeMenu} />
                <MenuLike to="/login" label="로그인" closeMenu={closeMenu} />
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

const MenuLike = ({ to, label, closeMenu }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')} onClick={closeMenu}>
    {label}
  </NavLink>
)

const Hamburger = ({ isMenuActive, toggleMenu }) => (
  <button className={`${css.hamburger} ${isMenuActive ? css.active : ''}`} onClick={toggleMenu}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="bi bi-list"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
      />
    </svg>
  </button>
)
