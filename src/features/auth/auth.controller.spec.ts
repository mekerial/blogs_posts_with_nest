import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

let authController: AuthController;

beforeEach(async () => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [AuthService],
  }).compile();

  authController = app.get<AuthController>(AuthController);
});

describe('root', () => {
  it('should return "Hello World!"', () => {
    expect(
      authController.registrationUser({
        login: 'mekerial',
        password: 'qwertys',
        email: 'merehohp2@gmail.com',
      }),
    ).toBe('Hello World!');
  });
});
