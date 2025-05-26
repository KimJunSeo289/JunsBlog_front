import { useNavigate, useParams } from 'react-router-dom'
import css from './editepost.module.css'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import QuillEditor from '../components/QuillEditor'
import { getPostDetail, updatePost } from '../apis/postApi'

export const EditePost = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const [currentImage, setCurrentImage] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const postData = await getPostDetail(postId)

        if (postData.author !== user?.username) {
          setError('자신의 글만 수정할 수 있습니다')
          navigate('/')
          return
        }

        setTitle(postData.title)
        setSummary(postData.summary)
        setContent(postData.content)

        if (postData.cover) {
          setCurrentImage(`${import.meta.env.VITE_BACK_URL}/${postData.cover}`)
        }
      } catch (error) {
        console.error('글 정보 불러오기 실패:', error)
        setError('글 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.username) {
      fetchPost()
    }
  }, [postId, user?.username, navigate])

  const handleContentChange = content => {
    setContent(content)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!title || !summary || !content) {
      setError('모든 필드를 입력해주세요')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('summary', summary)
      formData.set('content', content)

      if (files?.[0]) {
        formData.set('files', files[0])
      }

      await updatePost(postId, formData)

      navigate(`/detail/${postId}`)
    } catch (error) {
      console.error('글 수정 실패:', error)
      setError(error.response?.data?.error || '글 수정에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className={css.loading}>글 정보를 불러오는 중...</div>
  }

  return (
    <main className={css.editepost}>
      <h2>글 수정하기</h2>

      {error && <div className={css.error}>{error}</div>}

      <form className={css.writecon} onSubmit={handleSubmit}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          required
        />

        <label htmlFor="summary">요약내용</label>
        <input
          type="text"
          id="summary"
          name="summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="요약내용을 입력해주세요"
          required
        />

        <label htmlFor="files" hidden>
          파일첨부
        </label>
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
        />

        {currentImage && (
          <>
            <label>현재 이미지:</label>
            <img src={currentImage} alt="현재 이미지" className={css.previewImage} />
            <p className={css.imageNote}>새 이미지를 업로드하면 기존 이미지는 대체됩니다.</p>
          </>
        )}

        <label htmlFor="content" />
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={css.submitButton}>
          {isSubmitting ? '수정 중...' : '수정하기'}
        </button>
      </form>
    </main>
  )
}
