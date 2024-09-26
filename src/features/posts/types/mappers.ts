import { PostViewModel } from './post.types';
import { HydratedDocument } from 'mongoose';
import { Post } from '../schemas/post.schema';

export async function transformPostToViewModel(posts: any[]) {
  const postsViewModel: PostViewModel[] = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i] as HydratedDocument<Post>;
    postsViewModel.push({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: 'None',
        newestLikes: post.extendedLikesInfo.newestLikes,
      },
    });
  }
  return postsViewModel;
}
