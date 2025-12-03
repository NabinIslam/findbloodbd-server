import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
      : {};

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      // exclude password field
      select: [
        'id',
        'name',
        'email',
        'role',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });

    const totalPages = Math.ceil(total / limit);

    const meta = {
      total,
      currentPage: page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      message: 'Users retrieved successfully',
      data: { data: users, meta },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'role',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    try {
      const user = await this.userRepository.update(id, updateUserDto);

      if (user.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User updated successfully',
        data: await this.userRepository.findOne({
          where: { id },
          select: [
            'id',
            'name',
            'email',
            'role',
            'avatar',
            'createdAt',
            'updatedAt',
          ],
        }),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '22P02') {
        throw new BadRequestException(
          'Invalid enum value provided. Role must be either USER or ADMIN',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.delete(id);

    if (user.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
    };
  }
}
