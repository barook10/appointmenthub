import { useState, useCallback, useRef } from 'react'

let toastId = 0

export default function useToast() {
  const [toasts, setToasts] = useState([])
  const timers  = useRef({})

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    timers.current[id] = setTimeout(() => dismiss(id), 3200)
  }, [])

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, showToast, dismiss }
}
