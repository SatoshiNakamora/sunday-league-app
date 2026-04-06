'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: Toast
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Return default values if used outside provider
    return {
      toast: { message: '', type: 'info' as ToastType },
      showToast: () => {},
    }
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info' })

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type })
  }

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function ToastDisplay({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast.message) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.message])

  if (!toast.message || !visible) return null

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-pitch-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  }

  const backgrounds = {
    success: 'bg-pitch-500/10 border-pitch-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-up">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${backgrounds[toast.type]} backdrop-blur-sm shadow-xl`}>
        {icons[toast.type]}
        <span className="text-white text-sm">{toast.message}</span>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}