import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import data from '../support/data'
import build from '../support/builders'

import { createSessionInterceptor }
  from '../../src/interceptors/session'
import {
  teamAuthTokenUrl,
  teamBuildsUrl,
  teamPipelinesUrl
} from '../../src/support/urls'
import {
  basicAuthHeader,
  bearerAuthHeader,
  csrfTokenHeader
} from '../../src/support/http'

describe('session interceptor', () => {
  it('fetches token on first request when none provided',
    async () => {
      const apiUrl = data.randomApiUrl()
      const teamName = data.randomTeamName()
      const csrfToken = data.randomCsrfToken()

      const credentials = {
        username: data.randomUsername(),
        password: data.randomPassword(),
        url: teamAuthTokenUrl(apiUrl, teamName),
        token: undefined
      }
      const httpClient = axios.create()
      const mock = new MockAdapter(httpClient)

      const bearerToken = data.randomBearerToken({csrf: csrfToken})
      const authToken = build.api.authToken({value: bearerToken})

      const interceptor = createSessionInterceptor({credentials, httpClient})

      mock
        .onGet(credentials.url, {
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

  it('does not fetch token if provided and still valid',
    async () => {
      const apiUrl = data.randomApiUrl()
      const teamName = data.randomTeamName()
      const csrfToken = data.randomCsrfToken()
      const bearerToken = data.randomBearerToken({csrf: csrfToken})

      const credentials = {
        username: data.randomUsername(),
        password: data.randomPassword(),
        url: teamAuthTokenUrl(apiUrl, teamName),
        token: bearerToken
      }
      const httpClient = axios.create()

      const interceptor = createSessionInterceptor({credentials, httpClient})

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
      const apiUrl = data.randomApiUrl()
      const teamName = data.randomTeamName()
      const csrfToken = data.randomCsrfToken()

      const credentials = {
        username: data.randomUsername(),
        password: data.randomPassword(),
        url: teamAuthTokenUrl(apiUrl, teamName),
        token: undefined
      }
      const httpClient = axios.create()
      const mock = new MockAdapter(httpClient)

      const bearerToken = data.randomBearerToken({csrf: csrfToken})
      const authToken = build.api.authToken({value: bearerToken})

      const interceptor = createSessionInterceptor({credentials, httpClient})

      mock
        .onGet(credentials.url, {
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
      expect(mock.history.get).to.have.length(1)
    })

  it('retains existing headers', async () => {
    const apiUrl = data.randomApiUrl()
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()
    const bearerToken = data.randomBearerToken({csrf: csrfToken})

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      url: teamAuthTokenUrl(apiUrl, teamName),
      token: bearerToken
    }
    const httpClient = axios.create()

    const interceptor = createSessionInterceptor({credentials, httpClient})

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
  });

  it('re-fetches token after expiry', async () => {
    const apiUrl = data.randomApiUrl()
    const teamName = data.randomTeamName()
    const oldCsrfToken = data.randomCsrfToken()
    const expiredBearerToken = data.randomBearerToken({
      csrf: oldCsrfToken,
    }, {
      expiresIn: '0 milliseconds'
    })

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      url: teamAuthTokenUrl(apiUrl, teamName),
      token: expiredBearerToken
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const newCsrfToken = data.randomCsrfToken()
    const newBearerToken = data.randomBearerToken({csrf: newCsrfToken})
    const newAuthToken = build.api.authToken({value: newBearerToken})

    const interceptor = createSessionInterceptor({credentials, httpClient})

    mock
      .onGet(credentials.url, {
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
  });

  it('prevents concurrent token fetches', async () => {
    const apiUrl = data.randomApiUrl()
    const teamName = data.randomTeamName()
    const csrfToken = data.randomCsrfToken()

    const credentials = {
      username: data.randomUsername(),
      password: data.randomPassword(),
      url: teamAuthTokenUrl(apiUrl, teamName),
      token: undefined
    }
    const httpClient = axios.create()
    const mock = new MockAdapter(httpClient)

    const bearerToken = data.randomBearerToken({csrf: csrfToken})
    const authToken = build.api.authToken({value: bearerToken})

    const interceptor = createSessionInterceptor({credentials, httpClient})

    mock
      .onGet(credentials.url, {
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
    expect(mock.history.get).to.have.length(1)
  });
})
