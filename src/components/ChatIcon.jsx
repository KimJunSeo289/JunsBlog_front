import { useState } from 'react'
import css from './ChatIcon.module.css' // 원하는 위치, 스타일링

export default function ChatIcon({ onClick }) {
  return (
    <button className={css.chatIcon} onClick={onClick}>
      💬 {/* 이모지/아이콘 */}
    </button>
  )
}
