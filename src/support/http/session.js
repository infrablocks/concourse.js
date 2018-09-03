import axios from 'axios'
import jwt from 'jsonwebtoken'
import AwaitLock from 'await-lock'

import {
  basicAuthHeader,
  bearerAuthHeader,
  csrfTokenHeader
} from './headers'

import {
  currentUnixTime
} from '../date'

const isExpired = (token) => {
  const decoded = jwt.decode(token)
  const expiryInSeconds = decoded.exp
  const nowInSeconds = currentUnixTime()
  const tenMinutesInSeconds = 10 * 60 // allow for 10 minutes clock drift

  return nowInSeconds > (expiryInSeconds - tenMinutesInSeconds)
}

const ensureValidToken = async (token, credentials, httpClient) => {
  if (!token || isExpired(token)) {
    const response = await httpClient.get(credentials.url, {
      headers: {
        ...basicAuthHeader(credentials.username, credentials.password)
      }
    })
    return response.data.value
  }
  return token
}

export const createSessionInterceptor =
  ({credentials, httpClient = axios.create()}) => {
    let token = credentials.token
    let lock = new AwaitLock()

    return async (config) => {
      await lock.acquireAsync()
      try {
        token = await ensureValidToken(token, credentials, httpClient)
      } finally {
        lock.release()
      }

      const decoded = jwt.decode(token)
      const csrf = decoded.csrf

      return {
        ...config,
        headers: {
          ...config.headers,
          ...bearerAuthHeader(token),
          ...csrfTokenHeader(csrf)
        }
      }
    }
  }
