import { Link, useNavigate } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'
import { LikeButton } from './LikeButton'

export default function PostCard({ post }) {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/detail/${post._id}`)
  }

  const handleAuthorClick = e => {
    e.stopPropagation()
  }

  return (
    <article className={css.postcard} onClick={handleDetail}>
      <div className={css.post_img}>
        {!post.cover ? (
          <img src={'/src/assets/noImage.jpeg'} alt={'noImage'}></img>
        ) : (
          <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
        )}
      </div>
      <h3 className={css.title}>{post.title}</h3>

      <div className={css.info}>
        <p>
          <Link to={`/mypage/${post.author}`} onClick={handleAuthorClick} className={css.author}>
            {post.author}
          </Link>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </p>
        <p>
          <LikeButton postId={post._id} likes={post.likes} />
          <span>💬</span> <span>{post.commentCount || 0}</span>
        </p>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}
