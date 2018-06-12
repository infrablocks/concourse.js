import { expect } from 'chai';
import faker from 'faker';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { buildAuthToken, buildJob } from './builders';

import Fly from '../src/Fly';

describe('Fly', () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });

  after(() => {
    mock.restore();
  });

  describe('jobs', () => {
    it('gets all jobs in the supplied pipeline', async () => {
      const uri = 'https://concourse.example.com';

      const username = 'some-username';
      const password = 'some-password';

      const team = 'main';
      const pipeline = 'some-pipeline';

      const bearerToken = faker.random.alphaNumeric(800);
      const authToken = buildAuthToken({ value: bearerToken });

      const job = buildJob();

      mock.onGet(
        `${uri}/teams/${team}/auth/token`,
        {
          headers: {
            'Authorization': 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'
          }
        })
        .reply(200, authToken);

      mock.onGet(
        `${uri}/teams/${team}/pipelines/${pipeline}/jobs`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        })
        .reply(200, [job]);

      const fly = await new Fly({ uri, team })
        .login({ username, password });

      const jobs = await fly.jobs({ pipeline });

      expect(jobs).to.eql([job]);
    });
  })
});
