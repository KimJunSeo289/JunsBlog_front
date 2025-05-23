import { useNavigate } from 'react-router-dom'
import css from './likebutton.module.css'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { toggleLike } from '../apis/postApi'

export const LikeButton = ({ postId, likes, className = '' }) => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const userId = user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes ? likes.length : 0)

  useEffect(() => {
    if (userId && likes) {
      const userLiked = likes.includes(userId)
      setIsLiked(userLiked)
    } else {
      setIsLiked(false)
    }

    setLikesCount(likes ? likes.length : 0)
  }, [likes, userId])

  const handleLikeToggle = async e => {
    e.stopPropagation()

    try {
      const updatedPost = await toggleLike(postId)

      setIsLiked(PrevIsLiked => !PrevIsLiked)
      setLikesCount(updatedPost.likes.length)
    } catch (error) {
      console.error('좋아요 토글 실패:', error)

      if (error.reponse && error.response.stauts === 401) {
        alert('로그인이 필요합니다.')
        navigate('/login')
      }
    }
  }
  
  return (
    <span className={className}>
      <span onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{likesCount}</span>
    </span>
  )
}
