import axios from 'axios'
import jwt from 'jsonwebtoken'
import AwaitLock from 'await-lock'
import formurlencoded from 'form-urlencoded'

import {
  basicAuthorizationHeader,
  bearerAuthorizationHeader,
  contentTypeHeader,
  contentTypes,
  csrfTokenHeader
} from './headers'

import { currentUnixTime } from '../date'
import { parseJson } from './transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import * as semver from 'semver'

const flyClientId = 'fly'
const flyClientSecret = 'Zmx5'

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
    !authenticationState.idToken ||
    !authenticationState.serverVersion) {
    return true
  }

  const decoded = jwt.decode(authenticationState.idToken)
  const expiryInSeconds = decoded.exp
  const nowInSeconds = currentUnixTime()
  const tenMinutesInSeconds = 10 * 60 // allow for 10 minutes clock drift

  return nowInSeconds > (expiryInSeconds - tenMinutesInSeconds)
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

  return {
    idToken: value,
    accessToken: value,
    tokenType: type
  }
}

const authenticatePostVersion4 = async (credentials, httpClient) => {
  const data = formurlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid+profile+email+federated:id+groups'
  })

  const tokenResponse = await httpClient.post(
    credentials.tokenUrlPostVersion4,
    data,
    {
      headers: {
        ...basicAuthorizationHeader(flyClientId, flyClientSecret),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [ parseJson, camelcaseKeysDeep ]
    })

  const { accessToken, tokenType } = tokenResponse.data

  return {
    idToken: accessToken,
    accessToken,
    tokenType
  }
}

// eslint-disable-next-line camelcase
const authenticatePostVersion6_1 = async (credentials, httpClient) => {
  const data = formurlencoded({
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password,
    scope: 'openid profile email federated:id groups'
  })

  const tokenResponse = await httpClient.post(
    credentials.tokenUrlPostVersion6_1,
    data,
    {
      headers: {
        ...basicAuthorizationHeader(flyClientId, flyClientSecret),
        ...contentTypeHeader(contentTypes.formUrlEncoded)
      },
      transformResponse: [ parseJson, camelcaseKeysDeep ]
    })

  const { idToken, accessToken, tokenType } = tokenResponse.data

  return {
    idToken,
    accessToken,
    tokenType
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
    let lock = new AwaitLock()

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
