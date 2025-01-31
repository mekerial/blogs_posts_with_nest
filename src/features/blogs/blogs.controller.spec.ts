import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RouterPaths } from '../../common/routerPaths';
import { CreateBlogModel, UpdateBlogModel } from './types/blog.types';
import { AppModule } from '../../app.module';

describe('Blogs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).delete(RouterPaths.testing);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return empty array', async () => {
    const createResponse = await request(app.getHttpServer())
      .get(RouterPaths.blogs)
      .expect(200);

    expect(createResponse.body).toEqual({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      pagesCount: 0,
    });
  });

  it('should create a new blog', async () => {
    const blogData: CreateBlogModel = {
      name: 'New Blog',
      description: 'This is a new blog',
      websiteUrl: 'https://new-blog.com',
    };

    const response = await request(app.getHttpServer())
      .post(RouterPaths.blogs)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(blogData)
      .expect(201);

    const createdEntity = response.body;
    expect(createdEntity).toHaveProperty('id');
    expect(createdEntity.name).toBe(blogData.name);
    expect(createdEntity.description).toBe(blogData.description);
    expect(createdEntity.websiteUrl).toBe(blogData.websiteUrl);
  });

  it('should return 404 for non-existing blog', async () => {
    await request(app.getHttpServer())
      .get(`${RouterPaths.blogs}/non-existing-id`)
      .expect(404);
  });

  it('should update an existing blog', async () => {
    const blogData: CreateBlogModel = {
      name: 'Blog to Update',
      description: 'This blog will be updated',
      websiteUrl: 'https://blog-to-update.com',
    };

    // Создаем новый блог
    const createResponse = await request(app.getHttpServer())
      .post(RouterPaths.blogs)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(blogData)
      .expect(201);

    const createdEntity = createResponse.body;
    const updatedData: UpdateBlogModel = {
      name: 'Updated Blog Name',
      description: 'Updated description',
      websiteUrl: 'https://updated-blog.com',
    };

    // Обновляем блог
    await request(app.getHttpServer())
      .put(`${RouterPaths.blogs}/${createdEntity.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(updatedData)
      .expect(204);

    // Проверяем, что изменения применены
    const updatedBlog = await request(app.getHttpServer())
      .get(`${RouterPaths.blogs}/${createdEntity.id}`)
      .expect(200);

    expect(updatedBlog.body.name).toBe(updatedData.name);
    expect(updatedBlog.body.description).toBe(updatedData.description);
    expect(updatedBlog.body.websiteUrl).toBe(updatedData.websiteUrl);
  });

  it('should return 400 for invalid blog data (empty name)', async () => {
    const invalidBlogData: CreateBlogModel = {
      name: '',
      description: 'This blog has an empty name',
      websiteUrl: 'https://invalid-blog.com',
    };

    await request(app.getHttpServer())
      .post(RouterPaths.blogs)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(invalidBlogData)
      .expect(400);
  });

  it('should return 401 for unauthorized user', async () => {
    const blogData: CreateBlogModel = {
      name: 'Unauthorized Blog',
      description: 'This blog should not be created',
      websiteUrl: 'https://unauthorized-blog.com',
    };

    await request(app.getHttpServer())
      .post(RouterPaths.blogs)
      .set('authorization', 'Basic op') // Некорректная авторизация
      .send(blogData)
      .expect(401);
  });

  it('should return 400 for blog with invalid websiteUrl', async () => {
    const invalidBlogData: CreateBlogModel = {
      name: 'Invalid Blog',
      description: 'This blog has an invalid website URL',
      websiteUrl: 'htp://invalid-url.com', // Некорректный URL
    };

    await request(app.getHttpServer())
      .post(RouterPaths.blogs)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(invalidBlogData)
      .expect(400);
  });
});
