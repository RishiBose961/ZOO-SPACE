import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  exp?: number
}

let logoutTimer: ReturnType<typeof setTimeout> | null = null

export function startSession(token: string, onLogout: () => void) {
  try {
    const decoded = jwtDecode<JwtPayload>(token)

    if (!decoded.exp) {
      console.warn("JWT missing exp field")
      return 
    }

    const delay = decoded.exp * 1000 - Date.now()

    if (delay <= 0) {
      console.warn("JWT already expired")
      onLogout()
      return
    }

    logoutTimer = setTimeout(onLogout, delay)
  } catch (err) {
    console.error("JWT decode failed", err)
  }
}

export function endSession() {
  if (logoutTimer) {
    clearTimeout(logoutTimer)
    logoutTimer = null
  }
}
