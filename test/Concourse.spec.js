import { expect } from 'chai';
import faker from 'faker';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { buildAuthToken, buildJob, buildPipeline } from './builders';

import Concourse from '../src/Concourse';

const newConcourse = ({
  uri = faker.internet.url(),
  teamName = 'main',
  username = 'some-username',
  password = 'some-password',
} = {}) => new Concourse({ uri, teamName, username, password });

describe('Concourse', () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });

  after(() => {
    mock.restore();
  });

  describe('construction', () => {
    it('throws an exception if the URI is not provided', () => {
      expect(() => {
        new Concourse({})
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" is required].');
    });

    it('throws an exception if the URI is not a string', () => {
      expect(() => {
        new Concourse({ uri: 25 })
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" must be a string].');
    });

    it('throws an exception if the URI is not a valid URI', () => {
      expect(() => {
        new Concourse({ uri: 'spinach' })
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" must be a valid uri].');
    });

    it('throws an exception if the provided team name is not a string', () => {
      expect(
        () => {
          new Concourse({
            uri: faker.internet.url(),
            teamName: 35
          });
        })
        .to.throw(Error, 'Invalid parameter(s): ["teamName" must be a string].')
    });

    it('throws an exception if the provided username is not a string', () => {
      expect(
        () => {
          new Concourse({
            uri: faker.internet.url(),
            username: 35
          });
        })
        .to.throw(Error, 'Invalid parameter(s): ["username" must be a string].')
    });

    it('throws an exception if the provided password is not a string', () => {
      expect(
        () => {
          new Concourse({
            uri: faker.internet.url(),
            password: 35
          });
        })
        .to.throw(Error, 'Invalid parameter(s): ["password" must be a string].')
    });
  });

  describe('login', () => {
    it('throws an exception if the username is not provided', async () => {
      try {
        await newConcourse()
          .login({ password: 'some-password' });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["username" is required].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided username is not a string', async () => {
      try {
        await newConcourse()
          .login({ username: 25, password: 'some-password' });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["username" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the password is not provided', async () => {
      try {
        await newConcourse()
          .login({ username: 'some-username' });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["password" is required].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided password is not a string', async () => {
      try {
        await newConcourse()
          .login({ username: 'some-username', password: 25 });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["password" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided team name is not a string', async () => {
      try {
        await newConcourse()
          .login({
            username: 'some-username',
            password: 'some-password',
            teamName: 25
          });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["teamName" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('uses the provided team name instead of that provided at construction', async () => {
      const fly = await newConcourse({ teamName: 'initial' })
        .login({
          username: 'some-username',
          password: 'some-password',
          teamName: 'overridden'
        });

      expect(fly.teamName).to.eql('overridden');
    });
  });

  describe('jobs', () => {
    it('throws an exception if no pipeline is provided', async () => {
      try {
        await newConcourse().jobs({});
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["pipeline" is required].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided pipeline is not a string', async () => {
      try {
        await newConcourse().jobs({ pipeline: 25 });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["pipeline" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('gets jobs for the supplied team and pipeline', async () => {
      const uri = 'https://concourse.example.com';

      const username = 'some-username';
      const password = 'some-password';

      const teamName = 'main';
      const pipeline = 'some-pipeline';

      const bearerToken = faker.random.alphaNumeric(800);
      const authToken = buildAuthToken({ value: bearerToken });

      const job = buildJob();

      mock.onGet(
        `${uri}/teams/${teamName}/auth/token`,
        {
          headers: {
            'Authorization': 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'
          }
        })
        .reply(200, authToken);

      mock.onGet(
        `${uri}/teams/${teamName}/pipelines/${pipeline}/jobs`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        })
        .reply(200, [job]);

      const fly = await new Concourse({ uri, teamName })
        .login({ username, password });

      const jobs = await fly.jobs({ pipeline });

      expect(jobs).to.eql([job]);
    });
  });

  describe('pipelines', () => {
    it('throws an exception if the value provided for all is not a boolean', async () => {
      try {
        await newConcourse().pipelines({ all: 25 });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["all" must be a boolean].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('gets pipelines for the supplied team by default', async () => {
      const uri = 'https://concourse.example.com';

      const username = 'some-username';
      const password = 'some-password';

      const teamName = 'main';

      const bearerToken = faker.random.alphaNumeric(800);
      const authToken = buildAuthToken({ value: bearerToken });

      const pipeline = buildPipeline();

      mock.onGet(
        `${uri}/teams/${teamName}/auth/token`,
        {
          headers: {
            'Authorization': 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'
          }
        })
        .reply(200, authToken);

      mock.onGet(
        `${uri}/teams/${teamName}/pipelines`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        })
        .reply(200, [pipeline]);

      const fly = await new Concourse({ uri, teamName })
        .login({ username, password });

      const pipelines = await fly.pipelines();

      expect(pipelines).to.eql([pipeline]);
    });

    it('gets all pipelines if all is true', async () => {
      const uri = 'https://concourse.example.com';

      const username = 'some-username';
      const password = 'some-password';

      const teamName = 'main';

      const bearerToken = faker.random.alphaNumeric(800);
      const authToken = buildAuthToken({ value: bearerToken });

      const pipeline = buildPipeline();

      mock.onGet(
        `${uri}/teams/${teamName}/auth/token`,
        {
          headers: {
            'Authorization': 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'
          }
        })
        .reply(200, authToken);

      mock.onGet(
        `${uri}/pipelines`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        })
        .reply(200, [pipeline]);

      const fly = await new Concourse({ uri, teamName })
        .login({ username, password });

      const pipelines = await fly.pipelines({ all: true });

      expect(pipelines).to.eql([pipeline]);
    });

    it('gets pipelines for the supplied team when all is false', async () => {
      const uri = 'https://concourse.example.com';

      const username = 'some-username';
      const password = 'some-password';

      const teamName = 'main';

      const bearerToken = faker.random.alphaNumeric(800);
      const authToken = buildAuthToken({ value: bearerToken });

      const pipeline = buildPipeline();

      mock.onGet(
        `${uri}/teams/${teamName}/auth/token`,
        {
          headers: {
            'Authorization': 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'
          }
        })
        .reply(200, authToken);

      mock.onGet(
        `${uri}/teams/${teamName}/pipelines`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        })
        .reply(200, [pipeline]);

      const fly = await new Concourse({ uri, teamName })
        .login({ username, password });

      const pipelines = await fly.pipelines({ all: false });

      expect(pipelines).to.eql([pipeline]);
    });
  });
});
