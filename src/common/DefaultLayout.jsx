import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import './index.css'
import css from './defaultlayout.module.css'
import { useEffect } from 'react'
import { getUserProfile } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'
import { useDispatch } from 'react-redux'

export const DefaultLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile()
        dispatch(setUserInfo(res))
      } catch {
        dispatch(setUserInfo(null))
      }
    }

    fetchUser()
  }, [])

  return (
    <div className={css.defaultlayout}>
      <Header />
      <Outlet />
    </div>
  )
}
