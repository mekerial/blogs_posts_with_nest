import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsOptional } from 'class-validator';
import { Trim } from '../transform/trim';

export const isOptionalEmail = () =>
  applyDecorators(IsEmail(), Trim(), IsOptional());
