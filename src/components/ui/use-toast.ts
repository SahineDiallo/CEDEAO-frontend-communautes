"use client"
import * as React from "react"
import { ToastActionElement } from "./toast"
import { ToastProps } from "@radix-ui/react-toast"


const TOAST_LIMIT = 1

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastAction
}

type ToastAction = {
  altText: string
  element: ToastActionElement
}

type ToastState = {
  toasts: ToasterToast[]
}

const toastState = {
  toasts: [],
}

let listeners: ((state: ToastState) => void)[] = []

function subscribe(listener: (state: ToastState) => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function dispatch(
  action:
    | { type: "ADD_TOAST"; toast: ToasterToast }
    | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
    | { type: "DISMISS_TOAST"; toastId?: string },
) {
  if (action.type === "ADD_TOAST") {
    toastState.toasts = [action.toast, ...toastState.toasts].slice(0, TOAST_LIMIT)
  } else if (action.type === "UPDATE_TOAST") {
    toastState.toasts = toastState.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t))
  } else if (action.type === "DISMISS_TOAST") {
    toastState.toasts = action.toastId ? toastState.toasts.filter((t) => t.id !== action.toastId) : []
  }

  listeners.forEach((listener) => {
    listener(toastState)
  })
}

function toast({ ...props }: Omit<ToasterToast, "id"> & { duration?: number }) {
  const id = Math.random().toString(36).substring(2, 9)

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      onOpenChange: (open:boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update: (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      }),
  }
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(toastState)

  React.useEffect(() => {
    const unsubscribe = subscribe(setState)
    return () => {
      unsubscribe()
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

