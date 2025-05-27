import ReactModal from 'react-modal'
import css from './Modal.module.css'

export default function Modal({
  isOpen, // 모달 열림 여부
  onRequestClose, // 오버레이 클릭 or ESC 시 호출
  title, // 모달 제목
  content, // 모달 본문 (string 또는 ReactNode)
  confirmText = '확인', // 확인 버튼 텍스트
  cancelText, // 취소 버튼 텍스트 (onlyConfirm=false 일 때만)
  onConfirm, // 확인 버튼 클릭 핸들러
  onCancel, // 취소 버튼 클릭 핸들러
  onlyConfirm = false, // true 면 “알림” 모드 (취소 버튼 없이)
}) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={!onlyConfirm}
      overlayClassName={{
        base: css.modalOverlay,
        afterOpen: css.modalOverlayAfterOpen,
        beforeClose: css.modalOverlayBeforeClose,
      }}
      className={{
        base: css.modalContent,
        afterOpen: css.modalContentAfterOpen,
        beforeClose: css.modalContentBeforeClose,
      }}
      closeTimeoutMS={300}
    >
      <header className={css.modalHeader}>
        <h2>{title}</h2>
      </header>
      <div className={css.modalBody}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      <footer className={css.modalFooter}>
        {!onlyConfirm && cancelText && (
          <button className={css.modalBtnCancel} onClick={onCancel}>
            {cancelText}
          </button>
        )}
        <button className={css.modalBtnConfirm} onClick={onConfirm}>
          {confirmText}
        </button>
      </footer>
    </ReactModal>
  )
}
