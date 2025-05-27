import { useNavigate } from 'react-router-dom'
import css from './createpost.module.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import QuillEditor from '../components/QuillEditor'
import { createPost } from '../apis/postApi'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const user = useSelector(state => state.user?.user)
  const isAuthChecked = useSelector(state => state.user?.isAuthChecked)

  useEffect(() => {
    if (isAuthChecked && (!user || !user.username)) {
      navigate('/login')
    }
  }, [isAuthChecked, user, navigate])

  if (!isAuthChecked) {
    return <div>로그인 상태를 확인 중입니다...</div>
  }
  const handleContentChange = content => {
    setContent(content)
  }

  const handleCreatePost = async e => {
    e.preventDefault()

    setIsSubmitting(true)
    setError('')

    if (!title || !summary || !content) {
      setIsSubmitting(false)
      setError('모든 필드를 입력해주세요')
      return
    }

    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)

    if (files[0]) {
      data.set('files', files[0])
    }

    try {
      await createPost(data)

      setIsSubmitting(false)
      navigate('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
      setError('')
    }
  }

  return (
    <main className={css.createpost}>
      <h2>글쓰기</h2>
      {error && <div className={css.error}>{error}</div>}
      <form className={css.writecon} onSubmit={handleCreatePost}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          id="summary"
          name="summary"
          placeholder="요약내용을 입력해주세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
        />
        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록중...' : '등록'}
        </button>
      </form>
    </main>
  )
}
