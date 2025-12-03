import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPostData: { content: string; userId: number }) {
    // Check if user exists
    const userExists = await this.userRepository.findOne({
      where: { id: createPostData.userId },
    });

    if (!userExists) {
      throw new UnauthorizedException(
        'User account not found. Please log in again.',
      );
    }

    const post = this.postRepository.create(createPostData);
    const result = await this.postRepository.save(post);

    return { message: 'Post created successfully', data: result };
  }

  async findAll(userId: number) {
    const posts = await this.postRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Posts retrieved successfully',
      data: posts,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
