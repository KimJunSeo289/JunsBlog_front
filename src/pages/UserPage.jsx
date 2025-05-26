import { Link, useNavigate, useParams } from 'react-router-dom'
import css from './userpage.module.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUserComments,
  getUserInfo,
  getUserLikes,
  getUserPosts,
  deleteAccount,
} from '../apis/userApi'
import { formatDate } from '../utils/features'
import { setUserInfo } from '../store/userSlice'

export const UserPage = () => {
  const { username } = useParams()
  const [userData, setUserData] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentUser = useSelector(state => state.user.user)
  const isCurrentUser = currentUser && currentUser.username === username
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        const userData = await getUserInfo(username)
        const postsData = await getUserPosts(username)
        const commentsData = await getUserComments(username)
        const likesData = await getUserLikes(username)

        setUserData(userData)
        setUserPosts(postsData)
        setUserComments(commentsData)
        setUserLikes(likesData)
        setLoading(false)
      } catch (error) {
        console.error('사용자 데이터 로딩 실패:', error)
        setError('사용자 정보를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 계정 정보가 삭제됩니다.'
    )

    if (!confirmed) return

    try {
      setIsDeleting(true)
      await deleteAccount()

      dispatch(setUserInfo(''))

      alert('회원 탈퇴가 완료되었습니다.')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('회원 탈퇴 실패:', error)
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.')
      setIsDeleting(false)
    }
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>

  return (
    <main className={css.userpage}>
      <h2>{username}님의 페이지</h2>

      <section>
        <h3>사용자 정보</h3>
        <div className={css.userInfo}>
          <p>
            <strong>사용자 이름:</strong> {userData.username}
          </p>
          <p>
            <strong>가입일:</strong> {formatDate(userData.createdAt)}
          </p>
          {isCurrentUser && (
            <div className={css.buttonArea}>
              <Link to={`/update-profile`} className={css.editButton}>
                내 정보 수정
              </Link>
              <button
                onClick={handleDeleteAccount}
                className={css.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? '처리 중...' : '회원 탈퇴'}
              </button>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3>작성한 글 ({userPosts.length})</h3>
        {userPosts.length > 0 ? (
          <ul className={css.postList}>
            {userPosts.map(post => (
              <li key={post._id} className={css.postCard}>
                <Link to={`/detail/${post._id}`}>
                  <p className={css.title}>{post.title}</p>
                  <p className={css.postDate}>{formatDate(post.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>작성한 댓글 ({userComments.length})</h3>
        {userComments.length > 0 ? (
          <ul className={css.commentList}>
            {userComments.map(comment => (
              <li key={comment._id} className={css.commentCard}>
                <p className={css.commentContent}>{comment.content}</p>
                <div className={css.commentMeta}>
                  <Link to={`/detail/${comment.postId}`}>원문 보기</Link>
                  <p>작성일:{formatDate(comment.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 댓글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>좋아요 클릭한 글 ({userLikes.length})</h3>
        {userLikes.length > 0 ? (
          <ul className={css.likeList}>
            {userLikes.map(post => (
              <li key={post._id} className={css.likeCard}>
                <Link to={`/detail/${post._id}`}>
                  {post.cover ? (
                    <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
                  ) : (
                    <img src="https://picsum.photos/200/300" alt="기본 이미지" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>좋아요 클릭한 글이 없습니다.</p>
        )}
      </section>
    </main>
  )
}
