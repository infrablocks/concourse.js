import { Base64 } from 'js-base64'

const authorizationHeaderName = 'Authorization'
const csrfTokenHeaderName = 'X-Csrf-Token'
const contentTypeHeaderName = 'Content-Type'

export const contentTypes = {
  formUrlEncoded: 'application/x-www-form-urlencoded',
  yaml: 'application/x-yaml'
}

const basicAuthToken = (username, password) =>
  Base64.encode(`${username}:${password}`)

const basicAuthHeaderValue = (username, password) =>
  `Basic ${basicAuthToken(username, password)}`
const bearerAuthHeaderValue = (token) =>
  `Bearer ${token}`

export const basicAuthorizationHeader = (username, password) => ({
  [authorizationHeaderName]: basicAuthHeaderValue(username, password)
})
export const bearerAuthorizationHeader = (token) => ({
  [authorizationHeaderName]: bearerAuthHeaderValue(token)
})
export const csrfTokenHeader = (token) => ({
  [csrfTokenHeaderName]: token
})
export const contentTypeHeader = (contentType) => ({
  [contentTypeHeaderName]: contentType
})
