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

const mockClip = {
  title: 'Boom',
  o_site: 'youtube',
  description: 'woop de doop',
  clip_link: '52dWQtMSlrw'
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
  it('insert clip should insert a clip', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(chad);

    const res = await agent.post('/api/v1/clips/user').send(mockClip);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...mockClip,
      id: expect.any(String),
      created_at: null,
      users_id: expect.any(String)
    });
  });
  it('should delete video by id', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(chad);

    const res = await agent.delete('/api/v1/clips/2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '2',
      clip_link: '1puKDTa5kL8',
      users_id: '1',
      o_site: 'youtube',
      created_at: null,
      description:  null,
      title: 'Tossing someone into the pool'
    });

  });
});
afterAll(() => {
  pool.end();
});
