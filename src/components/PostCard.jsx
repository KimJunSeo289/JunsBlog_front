import { Link, useNavigate } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'
import { useEffect, useState } from 'react'
import { toggleLike } from '../apis/postApi'
import { useSelector } from 'react-redux'

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const userId = user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0)

  useEffect(() => {
    if (userId && post.likes) {
      const userLiked = post.likes.includes(userId)
      setIsLiked(userLiked)
    } else {
      setIsLiked(false)
    }
  }, [post, userId])

  const handleDetail = () => {
    navigate(`/detail/${post._id}`)
  }

  const handleAuthorClick = e => {
    e.stopPropagation()
  }

  const handleLikeToggle = async e => {
    e.stopPropagation()

    try {
      const updatedPost = await toggleLike(post._id)

      setIsLiked(!isLiked)
      setLikesCount(updatedPost.likes.length)
    } catch (error) {
      console.error('좋아요 토글 실패', error)

      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다.')
        navigate('/login')
      }
    }
  }

  return (
    <article className={css.postcard} onClick={handleDetail}>
      <div className={css.post_img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
      </div>
      <h3 className={css.title}>{post.title}</h3>

      <div className={css.info}>
        <p>
          <Link to={`/mypage/${post.author}`} onClick={handleAuthorClick} className={css.author}>
            somy
          </Link>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </p>
        <p>
          <span onClick={handleLikeToggle}> {isLiked ? '❤️' : '🤍'}</span> <span>{likesCount}</span>
          <span>💬</span> <span>30</span>
        </p>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}
