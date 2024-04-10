import '@/user/main/container';

import { appUser } from '@/user/main/user.server';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

describe('User Server', () => {
  it('should return status 200 and hello world message', async () => {
    const data = {
      name: 'adriano',
      email: 'adriano@email.com',
      password: '12345679'
    };
    const expected = {
      id: 'UUID',
      name: 'adriano',
      email: 'adriano@email.com',
    };

    const response = await request(appUser).post('/register').send(data);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(expected);
  });
});
