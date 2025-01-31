import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateBlogModel, UpdateBlogModel } from '../types/blog.types';
import { RouterPaths } from '../../../common/routerPaths';

export const blogsTestManager = {
  async createBlog(
    app: INestApplication,
    data: CreateBlogModel,
    expectedStatusCode = 201,
  ) {
    const response = await request(app.getHttpServer())
      .post(RouterPaths.blogs)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;
    if (expectedStatusCode === 201) {
      createdEntity = response.body;
      expect(createdEntity).toEqual({
        ...createdEntity,
        id: expect.any(String),
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
      });
    }
    return { response: response, createdEntity: createdEntity };
  },

  async updateBlog(
    app: INestApplication,
    id: string,
    data: UpdateBlogModel,
    expectedStatusCode: number,
  ) {
    const response = await request(app.getHttpServer())
      .put(`${RouterPaths.blogs}/${id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data)
      .expect(expectedStatusCode);

    if (expectedStatusCode === 204) {
      await request(app.getHttpServer())
        .get(`${RouterPaths.blogs}/${id}`)
        .expect(200, {
          id: id,
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl,
        });
    }
    return { response: response };
  },
};
