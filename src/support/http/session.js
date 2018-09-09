import axios from 'axios'
import jwt from 'jsonwebtoken'
import AwaitLock from 'await-lock'
import formurlencoded from 'form-urlencoded'

import {
  basicAuthHeader,
  bearerAuthHeader,
  contentTypeHeader,
  contentTypes,
  csrfTokenHeader
} from './headers'

import { currentUnixTime } from '../date'
import { parseJson } from './transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import * as semver from 'semver'

const isExpired = (token) => {
  const decoded = jwt.decode(token)
  const expiryInSeconds = decoded.exp
  const nowInSeconds = currentUnixTime()
  const tenMinutesInSeconds = 10 * 60 // allow for 10 minutes clock drift

  return nowInSeconds > (expiryInSeconds - tenMinutesInSeconds)
}

const fetchTokenPreVersion4 = async (credentials, httpClient) => {
  const response = await httpClient.get(credentials.tokenUrlPreVersion4, {
    headers: {
      ...basicAuthHeader(credentials.username, credentials.password)
    }
  })

  return response.data.value
}

const fetchTokenPostVersion4 = async (credentials, httpClient) => {
  const data = formurlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid+profile+email+federated:id+groups'
  })

  const response = await httpClient.post(
    credentials.tokenUrlPostVersion4,
    data,
    {
      headers: {
        ...basicAuthHeader('fly', 'Zmx5'),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [parseJson, camelcaseKeysDeep]
    })

  return response.data.accessToken
}

const fetchToken = async (credentials, httpClient) => {
  const serverInfo = await httpClient.get(credentials.infoUrl)
  const version = serverInfo.data.version

  if (semver.lt(version, '4.0.0')) {
    return fetchTokenPreVersion4(credentials, httpClient)
  } else {
    return fetchTokenPostVersion4(credentials, httpClient)
  }
}

const ensureValidToken = async (token, credentials, httpClient) => {
  return (!token || isExpired(token))
    ? fetchToken(credentials, httpClient)
    : token
}

export const createSessionInterceptor =
  ({ credentials, httpClient = axios.create() }) => {
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
