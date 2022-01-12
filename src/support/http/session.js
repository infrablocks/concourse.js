import axios from 'axios'
import jwt from 'jsonwebtoken'
import al from 'await-lock'
import formUrlencoded from 'form-urlencoded'

import {
  basicAuthorizationHeader,
  bearerAuthorizationHeader,
  contentTypeHeader,
  contentTypes,
  csrfTokenHeader
} from './headers.js'

import { currentUnixTime, toUnixTime } from '../date.js'
import { parseJson } from './transformers.js'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import semver from 'semver'

const AwaitLock = al.default

const flyClientId = 'fly'
const flyClientSecret = 'Zmx5'

const expiryFromJWT = token =>
  jwt.decode(token).exp
const unixTimeFromISO8601String = iso8601String =>
  Date.parse(iso8601String)
const unixTimeFromResponseHeader = response =>
  toUnixTime(new Date(response.headers.date))

const bearerAuthorizationHeaderFrom =
  authenticationState =>
    bearerAuthorizationHeader(
      authenticationState.accessToken)

const csrfTokenHeaderFrom =
  authenticationState =>
    semver.lt(authenticationState.serverVersion, '6.1.0')
      ? csrfTokenHeader(jwt.decode(authenticationState.idToken).csrf)
      : {}

const isExpiredOrIncomplete = authenticationState => {
  if (!authenticationState ||
    !authenticationState.accessToken ||
    !authenticationState.tokenType ||
    !authenticationState.expiresAt ||
    !authenticationState.idToken ||
    !authenticationState.serverVersion) {
    return true
  }

  const expiresAtSeconds = authenticationState.expiresAt
  const nowInSeconds = currentUnixTime()
  const tenMinutesInSeconds = 10 * 60 // allow for 10 minutes clock drift

  return nowInSeconds > (expiresAtSeconds - tenMinutesInSeconds)
}

const fetchServerVersion = async (credentials, httpClient) => {
  return (await httpClient.get(credentials.infoUrl)).data.version
}

const authenticatePreVersion4 = async (credentials, httpClient) => {
  const tokenResponse = await httpClient.get(credentials.tokenUrlPreVersion4, {
    headers: {
      ...basicAuthorizationHeader(credentials.username, credentials.password)
    }
  })

  const { value, type } = tokenResponse.data
  const expiresAt = expiryFromJWT(value)

  return {
    accessToken: value,
    tokenType: type,
    expiresAt: expiresAt,
    idToken: value
  }
}

const authenticatePostVersion4 = async (credentials, httpClient) => {
  const data = formUrlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid+profile+email+federated:id+groups'
  })

  const tokenResponse = await httpClient.post(
    credentials.tokenUrlPreVersion6_1,
    data,
    {
      headers: {
        ...basicAuthorizationHeader(flyClientId, flyClientSecret),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [parseJson, camelcaseKeysDeep]
    })

  const { accessToken, expiry, tokenType } = tokenResponse.data
  const expiresAt = unixTimeFromISO8601String(expiry)

  return {
    accessToken,
    tokenType,
    expiresAt,
    idToken: accessToken
  }
}

// eslint-disable-next-line camelcase
const authenticatePostVersion6_1 = async (credentials, httpClient) => {
  const data = formUrlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid profile email federated:id groups'
  })

  const tokenResponse = await httpClient.post(
    credentials.tokenUrlCurrent,
    data,
    {
      headers: {
        ...basicAuthorizationHeader(flyClientId, flyClientSecret),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [parseJson, camelcaseKeysDeep]
    })

  const { idToken, accessToken, tokenType, expiresIn } = tokenResponse.data
  const expiresAt = unixTimeFromResponseHeader(tokenResponse) + expiresIn

  return {
    accessToken,
    tokenType,
    expiresAt,
    idToken
  }
}

const authenticate = async (credentials, httpClient) => {
  const serverVersion = await fetchServerVersion(credentials, httpClient)

  let newAuthenticationState
  if (semver.lt(serverVersion, '4.0.0')) {
    newAuthenticationState =
      await authenticatePreVersion4(credentials, httpClient)
  } else if (semver.lt(serverVersion, '6.1.0')) {
    newAuthenticationState =
      await authenticatePostVersion4(credentials, httpClient)
  } else {
    newAuthenticationState =
      await authenticatePostVersion6_1(credentials, httpClient)
  }

  return {
    ...newAuthenticationState,
    serverVersion
  }
}

const ensureAuthenticated =
  async (authenticationState, credentials, httpClient) => {
    return isExpiredOrIncomplete(authenticationState)
      ? authenticate(credentials, httpClient)
      : authenticationState
  }

export const createSessionInterceptor =
  ({ credentials, httpClient = axios.create() }) => {
    let authenticationState = credentials.authenticationState
    const lock = new AwaitLock()

    return async (config) => {
      await lock.acquireAsync()
      try {
        authenticationState =
          await ensureAuthenticated(
            authenticationState, credentials, httpClient)
      } finally {
        lock.release()
      }

      const bearerAuthHeader =
        bearerAuthorizationHeaderFrom(authenticationState)
      const csrfTokenHeader =
        csrfTokenHeaderFrom(authenticationState)

      return {
        ...config,
        headers: {
          ...config.headers,
          ...bearerAuthHeader,
          ...csrfTokenHeader
        }
      }
    }
  }
