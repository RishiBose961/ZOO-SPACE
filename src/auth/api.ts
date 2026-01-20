import axios from "axios"

import { endSession } from "../auth/session"
import { store } from "@/store"
import { logoutUserAction } from "@/slice/authSlice"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
})

api.interceptors.response.use(
  res => res,
  err => {
    if (
      err.response?.status === 401 &&
      localStorage.getItem("token")
    ) {
      endSession()
      store.dispatch(logoutUserAction())
      window.location.replace("/login")
    }
    return Promise.reject(err)
  }
)

export default api
