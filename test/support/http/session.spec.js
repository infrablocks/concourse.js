import "core-js/stable";
import "regenerator-runtime/runtime";
import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import formurlencoded from 'form-urlencoded'
import { filter } from 'ramda'

import data from '../../testsupport/data'
import build from '../../testsupport/builders'

import { createSessionInterceptor }
  from '../../../src/support/http/session'
import {
  infoUrl,
  skyTokenUrl,
  skyIssuerTokenUrl,
  teamAuthTokenUrl,
  teamBuildsUrl,
  teamPipelinesUrl
} from '../../../src/support/urls'
import {
  basicAuthorizationHeader,
  bearerAuthorizationHeader,
  csrfTokenHeader
} from '../../../src/support/http/headers'

describe('session interceptor', () => {
  it('fetches token on first request when none provided and concourse ' +
    'version is < 4',
  async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      authenticationState: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerTokenPre4({ csrf: csrfToken })
    const tokenResponseBody = build.api.tokenResponseBodyPreVersion4({ value: bearerToken })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '3.14.1'
      }))

    mock
      .onGet(credentials.tokenUrlPreVersion4, {
        headers: {
          ...basicAuthorizationHeader(credentials.username, credentials.password)
        }
      })
      .reply(200, tokenResponseBody)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthorizationHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('fetches token on first request when none provided and concourse ' +
    'version is >= 4',
  async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      authenticationState: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerTokenPost4({
      csrf: csrfToken
    })
    const tokenResponseBody = build.api.tokenResponseBodyPostVersion4({
      accessToken: bearerToken
    })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '4.0.0'
      }))

    const expectedData = formurlencoded({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: 'openid+profile+email+federated:id+groups'
    })

    mock
      .onPost(credentials.tokenUrlPostVersion4, expectedData)
      .reply(200, tokenResponseBody)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthorizationHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('fetches token on first request when none provided and concourse ' +
    'version is >= 6.1',
  async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      authenticationState: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const idToken = data.randomIdTokenPost6_1()
    const bearerToken = data.randomBearerTokenPost6_1()
    const tokenResponseBody = build.api.tokenResponseBodyPostVersion6_1({
      idToken,
      accessToken: bearerToken
    })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '6.1.0'
      }))

    const expectedData = formurlencoded({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: 'openid profile email federated:id groups'
    })

    mock
      .onPost(credentials.tokenUrlPostVersion6_1, expectedData)
      .reply(200, tokenResponseBody)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthorizationHeader(bearerToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('does not fetch token if provided and still valid',
    async () => {
      const concourseUrl = data.randomConcourseUrl()
      const apiUrl = `${concourseUrl}/api/v1`
      const teamName = data.randomTeamName()
      const csrfToken = data.randomCsrfToken()
      const bearerToken = data.randomBearerTokenPost4({
        csrf: csrfToken
      })
      const authenticationState = {
        accessToken: bearerToken,
        idToken: bearerToken,
        tokenType: 'bearer',
        serverVersion: '4.0.0'
      }

      const credentials = {
        username: data.randomUsername(),
        password: data.randomPassword(),
        tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
        tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
        tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
        infoUrl: infoUrl(apiUrl),
        authenticationState
      }
      const httpClient = axios.create()

      const interceptor = createSessionInterceptor({ credentials, httpClient })

      const initialConfig = {
        url: teamPipelinesUrl(apiUrl, teamName),
        method: 'get'
      }
      const updatedConfig = await interceptor(initialConfig)
      const expectedConfig = {
        url: teamPipelinesUrl(apiUrl, teamName),
        method: 'get',
        headers: {
          ...bearerAuthorizationHeader(bearerToken),
          ...csrfTokenHeader(csrfToken)
        }
      }

      expect(updatedConfig).to.eql(expectedConfig)
    })

  it('does not fetch token on calls after the first if still valid',
    async () => {
      const concourseUrl = data.randomConcourseUrl()
      const apiUrl = `${concourseUrl}/api/v1`
      const teamName = data.randomTeamName()
      const csrfToken = data.randomCsrfToken()

      const credentials = {
        username: data.randomUsername(),
        password: data.randomPassword(),
        tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
        tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
        tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
        infoUrl: infoUrl(apiUrl),
        authenticationState: undefined
      }
      const httpClient = axios.create()
      const mock = new MockAdapter(httpClient)

      const bearerToken = data.randomBearerTokenPost4({
        csrf: csrfToken
      })
      const tokenResponseBody = build.api.tokenResponseBodyPostVersion4({
        accessToken: bearerToken
      })

      const interceptor = createSessionInterceptor({ credentials, httpClient })

      const expectedData = formurlencoded({
        grant_type: 'password',
        username: credentials.username,
        password: credentials.password,
        scope: 'openid+profile+email+federated:id+groups'
      })

      mock
        .onGet(credentials.infoUrl)
        .reply(200, build.api.info({
          version: '4.0.0'
        }))

      mock
        .onPost(credentials.tokenUrlPostVersion4, expectedData)
        .reply(200, tokenResponseBody)

      const firstCallInitialConfig = {
        url: teamPipelinesUrl(apiUrl, teamName),
        method: 'get'
      }
      const firstCallUpdatedConfig = await interceptor(firstCallInitialConfig)
      const firstCallExpectedConfig = {
        url: teamPipelinesUrl(apiUrl, teamName),
        method: 'get',
        headers: {
          ...bearerAuthorizationHeader(bearerToken),
          ...csrfTokenHeader(csrfToken)
        }
      }

      const secondCallInitialConfig = {
        url: teamBuildsUrl(apiUrl, teamName),
        method: 'get'
      }
      const secondCallUpdatedConfig = await interceptor(secondCallInitialConfig)
      const secondCallExpectedConfig = {
        url: teamBuildsUrl(apiUrl, teamName),
        method: 'get',
        headers: {
          ...bearerAuthorizationHeader(bearerToken),
          ...csrfTokenHeader(csrfToken)
        }
      }

      expect(firstCallUpdatedConfig).to.eql(firstCallExpectedConfig)
      expect(secondCallUpdatedConfig).to.eql(secondCallExpectedConfig)

      const postRequests = mock.history.post
      const tokenRequests = filter(
        (request) => request.url === credentials.tokenUrlPostVersion4,
        postRequests)

      expect(tokenRequests).to.have.length(1)
    })

  it('retains existing headers', async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()
    const bearerToken = data.randomBearerTokenPost4({
      csrf: csrfToken
    })
    const authenticationState = {
      accessToken: bearerToken,
      idToken: bearerToken,
      tokenType: 'bearer',
      serverVersion: '4.0.0'
    }

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      authenticationState
    }
    const httpClient = axios.create()

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        Accept: 'application/xml'
      }
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        Accept: 'application/xml',
        ...bearerAuthorizationHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('re-fetches token after expiry', async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const oldCsrfToken = data.randomCsrfToken()
    const expiredBearerToken = data.randomBearerTokenPost4({
      csrf: oldCsrfToken
    }, {
      expiresIn: '0 milliseconds'
    })
    const tokenResponseBody = build.api.tokenResponseBodyPostVersion4({
      accessToken: expiredBearerToken
    })
    const authenticationState = {
      ...tokenResponseBody,
      serverVersion: '4.0.0'
    }

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      authenticationState
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const newCsrfToken = data.randomCsrfToken()
    const newBearerToken = data.randomBearerTokenPost4({
      csrf: newCsrfToken
    })
    const newTokenResponseBody = build.api.tokenResponseBodyPostVersion4({
      accessToken: newBearerToken
    })

    const interceptor = createSessionInterceptor({
      credentials, httpClient
    })

    const expectedData = formurlencoded({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: 'openid+profile+email+federated:id+groups'
    })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '4.0.0'
      }))

    mock
      .onPost(credentials.tokenUrlPostVersion4, expectedData)
      .reply(200, newTokenResponseBody)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthorizationHeader(newBearerToken),
        ...csrfTokenHeader(newCsrfToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('prevents concurrent token fetches', async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6_1: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      authenticationState: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerTokenPost4({
      csrf: csrfToken
    })
    const tokenResponseBody = build.api.tokenResponseBodyPostVersion4({
      accessToken: bearerToken
    })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    const expectedData = formurlencoded({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: 'openid+profile+email+federated:id+groups'
    })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '4.0.0'
      }))

    mock
      .onPost(credentials.tokenUrlPostVersion4, expectedData)
      .reply(200, tokenResponseBody)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const [result1, result2] = await Promise.all([
      interceptor(initialConfig),
      interceptor(initialConfig)
    ])
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthorizationHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(result1).to.eql(expectedConfig)
    expect(result2).to.eql(expectedConfig)

    const postRequests = mock.history.post
    const tokenRequests = filter(
      (request) => request.url === credentials.tokenUrlPostVersion4,
      postRequests)

    expect(tokenRequests).to.have.length(1)
  })
})
