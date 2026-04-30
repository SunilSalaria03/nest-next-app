import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from '../../shared/interfaces/auth.interface';
import { AUTH } from 'src/shared/constants/message.constant';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    const auth = await this.authService.login(loginDto);
    return {
      message: AUTH.LOGIN_SUCCESS,
      data: auth,
    };
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponse> {
    const auth = await this.authService.signup(signupDto);
    return {
      message: AUTH.REGISTER_SUCCESS,
      data: auth,
    };
  }
}
