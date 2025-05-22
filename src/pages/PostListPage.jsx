import { useCallback, useEffect, useRef, useState } from 'react'
import PostCard from '../components/PostCard'
import css from './postlistpage.module.css'
import { getPostList } from '../apis/postApi'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const observer = useRef()

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

        const data = await getPostList(page)
        console.log('목록조회 성공', data)

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
  }, [page])

  return (
    <main className={css.postlistpage}>
      <h2>글목록</h2>
      {error && <p className={css.errorMessage}>{error}</p>}
      {isLoading && page === 0 ? (
        <p>로딩중...</p>
      ) : postList.length === 0 ? (
        <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
      ) : (
        <ul className={css.postList} ref={listRef}>
          {postList.map((post, i) => (
            <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
