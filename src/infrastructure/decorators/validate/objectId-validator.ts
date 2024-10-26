import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../../features/blogs/blogs.repository';

@ValidatorConstraint({ name: 'BlogIdIsValid', async: true })
@Injectable()
export class BlogIdIsValidConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async validate(blogId: string) {
    const findBlog = await this.blogsRepository.getBlog(blogId);
    return !!findBlog;
  }

  defaultMessage() {
    return 'blogId is incorrect';
  }
}
export function BlogIdIsValid(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIdIsValidConstraint,
    });
  };
}
