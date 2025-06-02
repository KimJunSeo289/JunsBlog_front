import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import css from './ChatModal.module.css'
import { formatTime } from '../utils/features'
import Modal from './Modal'

const SOCKET_URL = import.meta.env.VITE_BACK_URL

export default function ChatModal({ open, onClose, username }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const socketRef = useRef(null)
  const [loginModal, setLoginModal] = useState(false)

  useEffect(() => {
    if (!open) return

    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })
    socketRef.current.on('chat history', history => {
      setMessages(history)
    })
    socketRef.current.on('chat message', msg => {
      setMessages(msgs => [...msgs, msg])
    })

    return () => {
      socketRef.current && socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 채팅창이 열릴 때, 로그인한 경우에만 입력창에 포커스
  useEffect(() => {
    if (open && username) {
      inputRef.current && inputRef.current.focus()
    }
  }, [open, username])

  // 입력창 클릭 시 로그인 체크
  const handleInputFocus = () => {
    if (loginModal) return
    if (!username) setLoginModal(true)
  }

  // 전송 버튼 클릭 시 로그인 체크
  const handleButtonClick = e => {
    if (!username) {
      setLoginModal(true)
      e.preventDefault()
    }
  }

  // 메시지 전송 시 로그인 체크
  const sendMessage = e => {
    e.preventDefault()
    if (!username) {
      setLoginModal(true)
      return
    }
    if (input.trim() === '') return
    const msg = { user: username, text: input }
    socketRef.current && socketRef.current.emit('chat message', msg)
    setInput('')
  }

  const handleLoginConfirm = () => {
    setLoginModal(false)
    window.location.href = '/login'
  }

  if (!open) return null

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <header className={css.header}>
          <span>실시간 채팅</span>
          <button onClick={onClose}>✕</button>
        </header>
        <div className={css.chatBody}>
          {messages.map((m, i) => {
            const isMine = m.user === username
            return (
              <div key={i} className={`${css.chatRow} ${isMine ? css.mine : css.others}`}>
                {!isMine && <div className={css.nickname}>{m.user}</div>}
                <div className={css.bubbleWrapper}>
                  {isMine ? (
                    <>
                      <div className={css.time}>{m.createdAt && formatTime(m.createdAt)}</div>
                      <div className={css.bubble}>{m.text}</div>
                    </>
                  ) : (
                    <>
                      <div className={css.bubble}>{m.text}</div>
                      <div className={css.time}>{m.createdAt && formatTime(m.createdAt)}</div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={endRef}></div>
        </div>
        <form className={css.form} onSubmit={sendMessage}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={username ? '메시지 입력...' : '로그인 하여 채팅에 참여하세요'}
            onFocus={handleInputFocus}
            disabled={loginModal}
          />
          <button type="submit" onClick={handleButtonClick}>
            전송
          </button>
        </form>
        <Modal
          isOpen={loginModal}
          onRequestClose={() => setLoginModal(false)}
          title="로그인 필요"
          content="채팅을 이용하려면 로그인이 필요합니다."
          onlyConfirm={false}
          confirmText="로그인 하러가기"
          cancelText="닫기"
          onConfirm={handleLoginConfirm}
          onCancel={() => setLoginModal(false)}
        />
      </div>
    </div>
  )
}
