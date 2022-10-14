const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'lamp@shade.com',
  GamerTag: 'Zorb',
  password_hash: '12345',
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
  
  it('Create a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { GamerTag, email } = mockUser;
      
    expect(res.body).toEqual({
      id: expect.any(String),
      GamerTag,
      email,
    });
  });
  afterAll(() => {
    pool.end();
  });
    








});
