import { BlogViewModel } from './blog.types';
import { HydratedDocument } from 'mongoose';
import { Blog } from '../schemas/blog.schema';

export async function transformBlogToViewModel(blogs: any[]) {
  const blogsViewModel: BlogViewModel[] = [];
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i] as HydratedDocument<Blog>;
    blogsViewModel.push({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    });
  }
  return blogsViewModel;
}
