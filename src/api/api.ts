import axios from 'axios'

const isNativeApp = () => {
  if (typeof window === 'undefined') return false
  const hasCordova = typeof (window as any).cordova !== 'undefined'
  const hasCapacitor = typeof (window as any).Capacitor !== 'undefined'
  console.log('[API] isNativeApp:', hasCordova || hasCapacitor, { hasCordova, hasCapacitor, locationHref: typeof window !== 'undefined' ? window.location.href : undefined })
  return hasCordova || hasCapacitor
}

const normalizeNativeUrl = (baseUrl: string) => {
  try {
    const url = new URL(baseUrl)
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      url.hostname = '10.0.2.2'
      return url.toString()
    }
  } catch {
    // if parsing fails, fall back to default native host handling
  }
  return baseUrl
}

const getBaseURL = () => {
  const backendUrl = 'https://fiteat-kqma.vercel.app/api'
  if (isNativeApp()) {
    return normalizeNativeUrl(backendUrl)
  }
  return backendUrl
}

const API = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitAuthToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const baseURL = getBaseURL()
  console.log('[API] request baseURL =', baseURL)
  config.baseURL = baseURL

  return config
})

export default API
