import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(
    @Body() body: { username: string; password: string; email: string },
  ) {
    console.log('body', body);
    return { message: 'Register endpoint', data: body };
  }

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    console.log('body', body);
    return { message: 'Login endpoint', data: body };
  }
}
