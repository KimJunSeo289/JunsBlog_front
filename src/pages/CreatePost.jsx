import { useNavigate } from 'react-router-dom'
import css from './createpost.module.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const user = useSelector(state => state.user.user)

  useEffect(() => {
    if (!user || user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleContentChange = content => {
    setContent(content)
  }

  const handleCreatePost = async e => {
    e.preventDefault()
    console.log(제출)
    console.log(files)

    setIsSubmitting(true)
    setError('')

    if (!title || !summary || !content) {
      setIsSubmitting(false)
      setError('모든 필드를 입력해주세요')
      return
    }

    const data = new FormData()
    data.set(title)
  }
}
