import { Link } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'

export default function PostCard({ post }) {
  return (
    <article className={css.postcard}>
      <div className={css.post_img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
      </div>
      <h3 className={css.title}>{post.title}</h3>

      <div className={css.info}>
        <p>
          <Link to={`/mypage`} className={css.author}>
            {post.author}
          </Link>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </p>
        <p>
          <span>❤️</span> <span>30</span> <span>💬</span> <span>30</span>
        </p>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}
