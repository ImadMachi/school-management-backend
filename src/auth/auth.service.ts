import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findByEmail(email, {
      relations: ['role'],
      where: {
        email,
        disabled: false,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    // const isMatch = await bcrypt.compare(pass, user?.password);
    const isMatch = pass == user.password;

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
