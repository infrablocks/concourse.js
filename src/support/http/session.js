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
  const expiryInSeconds = token.expiry
  const nowInSeconds = currentUnixTime()
  const tenMinutesInSeconds = 10 * 60 // allow for 10 minutes clock drift

  return nowInSeconds > (expiryInSeconds - tenMinutesInSeconds)
}

const getExpiryFromJwt = (token) => {
  const decoded = jwt.decode(token)
  return decoded.exp
}

const getCsrfFromJwt = (token) => {
  const decoded = jwt.decode(token)
  return decoded.csrf
}

const fetchTokenPreVersion4 = async (credentials, httpClient) => {
  const response = await httpClient.get(credentials.tokenUrlPreVersion4, {
    headers: {
      ...basicAuthHeader(credentials.username, credentials.password)
    }
  })

  const token = response.data.value
  const csrf = getCsrfFromJwt(token)
  const expiry = getExpiryFromJwt(token)
  return {
    token,
    csrf,
    expiry
  }
}

const fetchTokenPreVersion6 = async (credentials, httpClient) => {
  const data = formurlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid+profile+email+federated:id+groups'
  })

  const response = await httpClient.post(
    credentials.tokenUrlPreVersion6,
    data,
    {
      headers: {
        ...basicAuthHeader('fly', 'Zmx5'),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [parseJson, camelcaseKeysDeep]
    })

  const token = response.data.accessToken
  const csrf = getCsrfFromJwt(token)
  const expiry = getExpiryFromJwt(token)
  return {
    token,
    csrf,
    expiry
  }
}

const fetchTokenPostVersion6 = async (credentials, httpClient) => {
  const data = formurlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid profile email federated:id groups'
  })

  const response = await httpClient.post(
    credentials.tokenUrlPostVersion6,
    data,
    {
      headers: {
        ...basicAuthHeader('fly', 'Zmx5'),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [parseJson, camelcaseKeysDeep]
    })

  const token = response.data.accessToken
  const csrf = getCsrfFromJwt(response.data.idToken)
  const expiry = getExpiryFromJwt(response.data.idToken)
  return {
    token,
    csrf,
    expiry
  }
}

const fetchToken = async (credentials, httpClient) => {
  const serverInfo = await httpClient.get(credentials.infoUrl)
  const version = serverInfo.data.version

  if (semver.lt(version, '4.0.0')) {
    return fetchTokenPreVersion4(credentials, httpClient)
  }

  if (semver.lt(version, '6.0.0')) {
    return fetchTokenPreVersion6(credentials, httpClient)
  }

  return fetchTokenPostVersion6(credentials, httpClient)
}

const ensureValidToken = async (token, credentials, httpClient) => {
  return (!token || !token.token || isExpired(token))
    ? fetchToken(credentials, httpClient)
    : token
}

export const createSessionInterceptor =
  ({ credentials, httpClient = axios.create() }) => {
    let lock = new AwaitLock()
    let token = credentials.token

    return async (config) => {
      await lock.acquireAsync()
      try {
        token = await ensureValidToken(token, credentials, httpClient)
      } finally {
        lock.release()
      }

      const csrfHeader = token.csrf ? csrfTokenHeader(token.csrf) : {}

      return {
        ...config,
        headers: {
          ...config.headers,
          ...bearerAuthHeader(token.token),
          ...csrfHeader
        }
      }
    }
  }
