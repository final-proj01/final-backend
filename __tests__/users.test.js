const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  GamerTag: 'Zorb',
  email: 'lamp@shade.com',
  password: '12345',
};

const mockUpdate = {
  bio: 'my shit',
  platforms: 'dont worry bout what i got',
  channelLinks: 'oh wait im really cheating'
};

const mockAvatar = {
  avatar_png: 'updatedAvatar',
};



const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('User routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('Create a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
      
    expect(res.body).toEqual({
      id: expect.any(String),
      avatar_png: null,
      bio: null,
      GamerTag: expect.any(String),
      email: expect.any(String),
      platforms: null,
      channelLinks: null,
      
    });
  });

  it('signs in existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    expect(res.status).toEqual(200);
  });


  it('throw 401 if not auth', async () => {
    const res = await request(app).get('/api/v1/users/protected');
    expect(res.status).toEqual(401);
  });

  it('protected user routes throw 200', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/protected');
    expect(res.status).toEqual(200);
  });

  it('deletes user session', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.status).toBe(204);
  });


  it('/me route grabs user info', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent
      .get('/api/v1/users/me');
    expect(res.body).toEqual({ 
      GamerTag: expect.any(String),
      email: expect.any(String), 
      id: expect.any(String),
      bio: null, 
      platforms: null,
      avatar_png: null,
      channelLinks: null
    });
    expect(res.status).toBe(200);
  });

  it('updates bio', async () => {
    const [agent] = await registerAndLogin(mockUser);
    const res = await agent
      .post('/api/v1/users/update')
      .send(mockUpdate);
    expect(res.body).toEqual({ 
      id: expect.any(String),
      GamerTag: expect.any(String),
      email: expect.any(String),
      avatar_png: null,
      ...mockUpdate
    });
    expect(res.status).toBe(200);
  });

  it('updates avatar_png', async () => {
    const [agent] = await registerAndLogin(mockUser);
    const res = await agent
      .post('/api/v1/users/updateAvatar')
      .send(mockAvatar);
    expect(res.body).toEqual({ 
      id: expect.any(String),
      GamerTag: expect.any(String),
      email: expect.any(String),
      avatar_png: 'updatedAvatar',
      bio: null, 
      platforms: null,
      channelLinks: null
    });
    expect(res.status).toBe(200);
  });


  afterAll(() => {
    pool.end();
  });
});
