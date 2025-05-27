import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PostCard from '../components/PostCard'
import css from './postlistpage.module.css'
import { getPostList } from '../apis/postApi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Modal from '../components/Modal'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState('createdAt')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const listRef = useRef(null)
  const observer = useRef()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)

  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })
      observer.current.observe(node)
    },
    [isLoading, hasMore]
  )

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        if (page > 0) setIsLoading(true)
        const data = await getPostList(page, 3, sortOption)

        setPostList(prev => (page === 0 ? data.posts : [...prev, ...data.posts]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('목록조회 실패:', error)
        setError('글 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostList()
  }, [page, sortOption])

  const handleWrite = () => {
    if (!user) {
      setModalContent('로그인이 필요합니다.')
      setModalOpen(true)
      return
    }
    navigate('/createPost')
  }

  const sortedPostList = useMemo(() => {
    return [...postList].sort((a, b) => {
      if (sortOption === 'likes') return b.likes.length - a.likes.length
      if (sortOption === 'commentCount') return b.commentCount - a.commentCount
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [postList, sortOption])

  const handleSortChange = e => {
    setSortOption(e.target.value)
    setPage(0)
  }

  return (
    <main className={css.postlistpage}>
      {error && <p className={css.errorMessage}>{error}</p>}
      <div className={css.topBar}>
        <button className={css.writeBtn} onClick={handleWrite}>
          글 작성
        </button>
        <select value={sortOption} onChange={handleSortChange} className={css.sortSelect}>
          <option value="createdAt">작성 순</option>
          <option value="likes">좋아요 순</option>
          <option value="commentCount">댓글 순</option>
        </select>
      </div>
      {isLoading && page === 0 ? (
        <p>로딩중...</p>
      ) : postList.length === 0 ? (
        <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
      ) : (
        <ul className={css.postList} ref={listRef}>
          {sortedPostList.map((post, i) => (
            <li key={post._id} ref={i === sortedPostList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title="알림"
        content={modalContent}
        onlyConfirm
        confirmText="확인"
        onConfirm={() => {
          setModalOpen(false)
          navigate('/login')
        }}
      />
    </main>
  )
}
