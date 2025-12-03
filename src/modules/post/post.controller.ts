import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Request() req: { user: { userId: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create({
      ...createPostDto,
      userId: parseInt(req.user.userId),
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.postService.findAll(parseInt(req.user.userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
