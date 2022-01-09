type StorageType = 'localStorage' | 'sessionStorage'

const useStorage = (storageType: StorageType) => {
  const isBrowser = (() => typeof window !== 'undefined')()

  const getItem = (key: string) =>
    isBrowser ? window[storageType].getItem(key) : null

  const setItem = (key: string, value: string) =>
    isBrowser ? window[storageType].setItem(key, value) : null

  const removeItem = (key: string) =>
    isBrowser ? window[storageType].removeItem(key) : null

  return { getItem, setItem, removeItem }
}

export default useStorage
