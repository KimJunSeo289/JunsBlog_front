import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import './index.css'
import css from './defaultlayout.module.css'
import { useEffect, useState } from 'react'
import { getUserProfile } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import ChatModal from '../components/ChatModal'
import ChatIcon from '../components/ChatIcon'

export const DefaultLayout = () => {
  const [chatOpen, setChatOpen] = useState(false)
  const user = useSelector(state => state.user.user)
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
      <ChatIcon onClick={() => setChatOpen(true)} />
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} username={user?.username} />
    </div>
  )
}
