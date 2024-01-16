import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin.dto';
import { Public } from 'src/common/decorators/public_route.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.sub);
  }
}
