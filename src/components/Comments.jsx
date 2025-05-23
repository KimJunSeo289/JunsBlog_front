import { useSelector } from 'react-redux'
import css from './comments.module.css'
import { useEffect, useState } from 'react'
import { createComment, getComments, updateComment } from '../apis/commentApi'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/features'
import { deleteComment } from '../apis/postApi'

export const Comments = ({ postId }) => {
  const userInfo = useSelector(state => state.user.user)

  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(postId)
        console.log('댓글 목록 조회 성공:', response)
        setComments(response)
      } catch (error) {
        console.error('댓글 목록 조회 실패:', error)
        alert('댓글 목록 조회에 실패했습니다.')
      }
    }
    fetchComments()
  }, [postId])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!newComment) {
      alert('댓글을 입력하세요')
      return
    }

    try {
      setIsLoading(true)

      const commentData = {
        content: newComment,
        author: userInfo.username,
        postId: postId,
      }

      const response = await createComment(commentData)
      console.log('댓글 등록 성공:', response)

      setComments(prevComments => [response, ...prevComments])
      setNewComment('')

      setIsLoading(false)
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert('댓글 등록에 실패했습니다.')
      setIsLoading(false)
    }
  }

  const handleDelete = async commentId => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        setIsLoading(true)
        const response = await deleteComment(commentId)
        console.log('댓글 삭제 성공:', response)
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId))
        setIsLoading(false)
      } catch (error) {
        console.error('댓글 삭제 실패:', error)
        alert('댓글 삭제에 실패했습니다.')
        setIsLoading(false)
      }
    }
  }

  const handleEditMode = comment => {
    setEditingCommentId(comment._id)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent('')
  }

  const handleUpdateComment = async commentId => {
    if (!editContent) {
      alert('댓글 내용을 입력하세요')
      return
    }
    try {
      setIsLoading(true)
      const response = await updateComment(commentId, editContent)
      console.log('댓글 수정 성공', response)

      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, content: editContent } : comment
        )
      )

      setEditingCommentId(null)
      setEditContent('')
      setIsLoading(false)
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다.')
      setIsLoading(false)
    }
  }

  return (
    <section className={css.comments}>
      {userInfo.username ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            disabled={isLoading}
          ></textarea>
          <button type="submit" disabled={isLoading}>
            {isLoading ? '등록 중...' : '댓글 등록'}
          </button>
        </form>
      ) : (
        <p className={css.logMessage}>
          댓글을 작성하려면 <Link to="/login">로그인이 필요합니다.</Link>
        </p>
      )}

      <ul>
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <li key={comment._id} className={css.list}>
              {editingCommentId === comment._id ? (
                <>
                  <div className={css.commnet}>
                    <p className={css.author}>{comment.author}</p>
                    <p className={css.date}>{formatDate(comment.createdAt)}</p>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className={css.text}
                      disabled={isLoading}
                    ></textarea>
                  </div>
                  <div className={css.btns}>
                    <button onClick={() => handleUpdateComment(comment._id)} disabled={isLoading}>
                      수정완료
                    </button>
                    <button onClick={handleCancelEdit} disabled={isLoading}>
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={css.commnet}>
                    <p className={css.author}>{comment.author}</p>
                    <p className={css.date}>{formatDate(comment.createdAt)}</p>
                    <p className={css.text}>{comment.content}</p>
                  </div>
                  {userInfo.username === comment.author && (
                    <div className={css.btns}>
                      <button onClick={() => handleEditMode(comment)}>수정</button>
                      <button onClick={() => handleDelete(comment._id)}>삭제</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))
        ) : (
          <li className={css.list}>
            <p className={css.text}>등록된 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
          </li>
        )}
      </ul>
    </section>
  )
}
