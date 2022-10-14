const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

const mockUser = {
  GamerTag: 'Zorb',
  email: 'lamp@shade.com',
  password: '12345',
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;

//   const agent = request.agent(app);

//   const user = await UserService.create({ ...mockUser, ...userProps });

//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send({ email, password });
//   return [agent, user];
// };

describe('User routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it.only('Create a new user', async () => {
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



  afterAll(() => {
    pool.end();
  });
});