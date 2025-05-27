import { Link, useNavigate, useParams } from 'react-router-dom'
import css from './postdetailpage.module.css'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { formatDate } from '../utils/features'
import { deletePost, getPostDetail } from '../apis/postApi'
import { LikeButton } from '../components/LikeButton'
import { Comments } from '../components/Comments'
import Modal from '../components/Modal'

export const PostDetailPage = () => {
  const { postId } = useParams()
  const username = useSelector(state => state.user.user.username)
  const [postInfo, setPostInfo] = useState({})
  const [commentCount, setCommentCount] = useState(0)

  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [isAlertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(postId)
        setPostInfo(data)
        setCommentCount(data.commentCount || 0)
      } catch (error) {
        console.error('상세정보 조회 실패:', error)
      }
    }
    fetchPostDetail()
  }, [postId])

  const updateCommentCount = count => {
    setCommentCount(count)
  }

  const openConfirm = () => setConfirmOpen(true)
  const closeConfirm = () => setConfirmOpen(false)

  const handleDelete = async () => {
    closeConfirm()
    setIsDeleting(true)
    try {
      await deletePost(postId)
      setAlertContent('글이 삭제되었습니다.')
      setAlertOpen(true)
    } catch (error) {
      console.error('글 삭제 실패:', error)
      setAlertContent('삭제에 실패했습니다. 다시 시도해주세요.')
      setAlertOpen(true)
      setIsDeleting(false)
    }
  }

  const closeAlert = () => {
    setAlertOpen(false)
    if (alertContent.includes('삭제되었습니다')) {
      navigate('/', { replace: true })
    }
  }

  return (
    <main className={css.postdetailpage}>
      <h1>{postInfo?.title}</h1>
      <div className={css.info}>
        <Link to={`/mypage/${postInfo?.author}`} className={css.author}>
          {postInfo?.author}
        </Link>
        <p className={css.date}>작성일 : {formatDate(postInfo?.updatedAt)}</p>
        <p>
          {postInfo && <LikeButton postId={postId} likes={postInfo.likes} />}{' '}
          <span style={{ marginLeft: '10px' }}>💬 {commentCount}</span>
        </p>
      </div>
      <section>
        {!postInfo?.cover ? (
          ' '
        ) : (
          <div className={css.detailimg}>
            <img src={`${import.meta.env.VITE_BACK_URL}/${postInfo?.cover}`} alt="" />
          </div>
        )}

        <div className={css.summary}>{postInfo?.summary}</div>
        {/* Quill 에디터로 작성된 HTML 콘텐츠를 렌더링 */}
        <div
          className={`${css.content} ql-content`}
          dangerouslySetInnerHTML={{ __html: postInfo?.content }}
        ></div>
      </section>

      <section className={css.btns}>
        {/* 로그인한 사용자만 글을 수정, 삭제할 수 있습니다. */}
        {username === postInfo?.author && (
          <>
            <Link to={`/edit/${postId}`}>수정</Link>
            <button onClick={openConfirm} disabled={isDeleting}>
              {isDeleting ? '처리 중...' : '삭제'}
            </button>
          </>
        )}
        <Link to="/">목록으로</Link>
      </section>

      {/* 업데이트된 Comments 컴포넌트에 commentCount와 updateCommentCount 함수 전달 */}
      <Comments
        postId={postId}
        commentCount={commentCount}
        onCommentCountChange={updateCommentCount}
      />

      <Modal
        isOpen={isConfirmOpen}
        onRequestClose={closeConfirm}
        title="글 삭제"
        content="정말 삭제하시겠습니까?"
        confirmText="예"
        cancelText="아니오"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />

      {/* 삭제 결과 알림 모달 */}
      <Modal
        isOpen={isAlertOpen}
        onRequestClose={closeAlert}
        title="알림"
        content={alertContent}
        onlyConfirm
        confirmText="확인"
        onConfirm={closeAlert}
      />
    </main>
  )
}
