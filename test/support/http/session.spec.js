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
  infoUrl, skyIssuerTokenUrl, skyTokenUrl,
  teamAuthTokenUrl,
  teamBuildsUrl,
  teamPipelinesUrl
} from '../../../src/support/urls'
import {
  basicAuthHeader,
  bearerAuthHeader,
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
      tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      token: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerToken({ csrf: csrfToken })
    const authToken = build.api.authTokenPreVersion4({ value: bearerToken })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '3.14.1'
      }))

    mock
      .onGet(credentials.tokenUrlPreVersion4, {
        headers: {
          ...basicAuthHeader(credentials.username, credentials.password)
        }
      })
      .reply(200, authToken)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('fetches token on first request when none provided and concourse ' +
    'version is < 6',
  async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      token: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerToken({ csrf: csrfToken })
    const authToken = build.api.authTokenPostVersion4({ accessToken: bearerToken })

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
      .onPost(credentials.tokenUrlPreVersion6, expectedData)
      .reply(200, authToken)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(updatedConfig).to.eql(expectedConfig)
  })

  it('fetches token on first request when none provided and concourse ' +
    'version is >= 6',
  async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      token: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerToken({ csrf: csrfToken })
    const authToken = build.api.authTokenPostVersion4({ accessToken: bearerToken })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '6.0.0'
      }))

    const expectedData = formurlencoded({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: 'openid+profile+email+federated:id+groups'
    })

    mock
      .onPost(credentials.tokenUrlPostVersion6, expectedData)
      .reply(200, authToken)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
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
      const bearerToken = data.randomBearerToken({ csrf: csrfToken })

      const credentials = {
        username: data.randomUsername(),
        password: data.randomPassword(),
        tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
        tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
        tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
        infoUrl: infoUrl(apiUrl),
        token: bearerToken
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
          ...bearerAuthHeader(bearerToken),
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
        tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
        tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
        infoUrl: infoUrl(apiUrl),
        token: undefined
      }
      const httpClient = axios.create()
      const mock = new MockAdapter(httpClient)

      const bearerToken = data.randomBearerToken({ csrf: csrfToken })
      const authToken = build.api.authTokenPreVersion4({ value: bearerToken })

      const interceptor = createSessionInterceptor({ credentials, httpClient })

      mock
        .onGet(credentials.infoUrl)
        .reply(200, build.api.info({
          version: '3.14.1'
        }))

      mock
        .onGet(credentials.tokenUrlPreVersion4, {
          headers: {
            ...basicAuthHeader(credentials.username, credentials.password)
          }
        })
        .reply(200, authToken)

      const firstCallInitialConfig = {
        url: teamPipelinesUrl(apiUrl, teamName),
        method: 'get'
      }
      const firstCallUpdatedConfig = await interceptor(firstCallInitialConfig)
      const firstCallExpectedConfig = {
        url: teamPipelinesUrl(apiUrl, teamName),
        method: 'get',
        headers: {
          ...bearerAuthHeader(bearerToken),
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
          ...bearerAuthHeader(bearerToken),
          ...csrfTokenHeader(csrfToken)
        }
      }

      expect(firstCallUpdatedConfig).to.eql(firstCallExpectedConfig)
      expect(secondCallUpdatedConfig).to.eql(secondCallExpectedConfig)

      const getRequests = mock.history.get
      const tokenRequests = filter(
        (request) => request.url === credentials.tokenUrlPreVersion4,
        getRequests)

      expect(tokenRequests).to.have.length(1)
    })

  it('retains existing headers', async () => {
    const concourseUrl = data.randomConcourseUrl()
    const apiUrl = `${concourseUrl}/api/v1`
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()
    const bearerToken = data.randomBearerToken({ csrf: csrfToken })

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      token: bearerToken
    }
    const httpClient = axios.create()

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        'Accept': 'application/xml'
      }
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        'Accept': 'application/xml',
        ...bearerAuthHeader(bearerToken),
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
    const expiredBearerToken = data.randomBearerToken({
      csrf: oldCsrfToken
    }, {
      expiresIn: '0 milliseconds'
    })

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      token: expiredBearerToken
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const newCsrfToken = data.randomCsrfToken()
    const newBearerToken = data.randomBearerToken({ csrf: newCsrfToken })
    const newAuthToken = build.api.authTokenPreVersion4({ value: newBearerToken })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '3.14.1'
      }))

    mock
      .onGet(credentials.tokenUrlPreVersion4, {
        headers: {
          ...basicAuthHeader(credentials.username, credentials.password)
        }
      })
      .reply(200, newAuthToken)

    const initialConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get'
    }
    const updatedConfig = await interceptor(initialConfig)
    const expectedConfig = {
      url: teamPipelinesUrl(apiUrl, teamName),
      method: 'get',
      headers: {
        ...bearerAuthHeader(newBearerToken),
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
      tokenUrlPreVersion6: skyTokenUrl(concourseUrl),
      tokenUrlPostVersion6: skyIssuerTokenUrl(concourseUrl),
      infoUrl: infoUrl(apiUrl),
      token: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerToken({ csrf: csrfToken })
    const authToken = build.api.authTokenPreVersion4({ value: bearerToken })

    const interceptor = createSessionInterceptor({ credentials, httpClient })

    mock
      .onGet(credentials.infoUrl)
      .reply(200, build.api.info({
        version: '3.14.1'
      }))

    mock
      .onGet(credentials.tokenUrlPreVersion4, {
        headers: {
          ...basicAuthHeader(credentials.username, credentials.password)
        }
      })
      .reply(200, authToken)

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
        ...bearerAuthHeader(bearerToken),
        ...csrfTokenHeader(csrfToken)
      }
    }

    expect(result1).to.eql(expectedConfig)
    expect(result2).to.eql(expectedConfig)

    const getRequests = mock.history.get
    const tokenRequests = filter(
      (request) => request.url === credentials.tokenUrlPreVersion4,
      getRequests)

    expect(tokenRequests).to.have.length(1)
  })
})
