import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { toggleLike } from '../apis/postApi'
import Modal from './Modal'

export const LikeButton = ({ postId, likes, className = '' }) => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const userId = user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes ? likes.length : 0)

  const [alertOpen, setAlertOpen] = useState(false)

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
      setAlertOpen(true)
    }
  }

  return (
    <>
      <span className={className}>
        <span onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
          {isLiked ? '❤️' : '🤍'}
        </span>
        <span>{likesCount}</span>
      </span>
      <Modal
        isOpen={alertOpen}
        onRequestClose={() => setAlertOpen(false)}
        title="알림"
        content="로그인이 필요합니다."
        onlyConfirm
        confirmText="확인"
        onConfirm={() => {
          setAlertOpen(false)
          navigate('/login')
        }}
      />
    </>
  )
}
