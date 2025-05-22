import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import './index.css'
import css from './defaultlayout.module.css'
import { PostListPage } from '../pages/PostListPage'

export const DefaultLayout = () => {
  return (
    <div className={css.defaultlayout}>
      <Header />
      <Outlet />
    </div>
  )
}
