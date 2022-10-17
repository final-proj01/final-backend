const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Clip = require('../lib/models/Clip');
// const UserService = require('../lib/services/UserService');


const chad = {
  email: 'stablerpsn@gmail.com',
  password: 'jimmyjango'
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;

//   const agent = request.agent(app);

//   const user = await UserService.create({ ...mockUser, ...userProps });

//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send({ email, password });
//   return [agent, user];
// };

describe('Clip routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('Fetch clips by user id', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(chad);
    const user = await agent.get('/api/v1/users/me');
    const res = await Clip.getClipsById(user.body.id);

    expect(res.length).toEqual(11);
  });
  it('fetch clips id working in controller', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(chad);
    const res = await agent.get('/api/v1/clips/user');
    expect(res.body.length).toEqual(11);
  });
});



afterAll(() => {
  pool.end();
});
