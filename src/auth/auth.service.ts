import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findByEmail(email);

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

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = oldPassword == user.password;

    if (!isMatch) {
      // throw exception with custom status code 1001
      throw new HttpException('Old password is incorrect', 421);
    }

    // user.password = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;

    await this.usersRepository.save(user);

    return user;
  }
}
