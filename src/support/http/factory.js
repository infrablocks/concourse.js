import axios from 'axios'
import { createSessionInterceptor } from './session'

export const createHttpClient = ({ credentials, timeout = 5000 }) => {
  const sessionInterceptor = createSessionInterceptor({ credentials })
  const instance = axios.create({ timeout })

  instance.interceptors.request.use(
    sessionInterceptor,
    (error) => Promise.reject(error))

  return instance
}
