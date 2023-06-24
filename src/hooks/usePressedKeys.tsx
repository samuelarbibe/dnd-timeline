import { useEffect, useState } from 'react'

const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>()

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [event.key]: true }))
    }

    const keyupHandler = (event: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [event.key]: false }))
    }

    window.addEventListener('keydown', keydownHandler)
    window.addEventListener('keyup', keyupHandler)

    return () => {
      window.removeEventListener('keydown', keydownHandler)
      window.removeEventListener('keyup', keyupHandler)
    }
  }, [])

  return pressedKeys
}

export default usePressedKeys
