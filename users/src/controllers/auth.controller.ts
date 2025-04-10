import {repository} from '@loopback/repository';
import {post, requestBody, HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {User} from '../models';
import {sign} from 'jsonwebtoken';
import {compare, hash} from 'bcryptjs';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  // Signup Method
  @post('/signup', {
    responses: {
      '200': {
        description: 'User Signup',
        content: {'application/json': {schema: {'x-ts-type': User}}},
      },
    },
  })
  async signup(
    @requestBody() userData: Omit<User, 'id'>,
  ) {
    userData.password = await hash(userData.password, 10);
    const newUser = await this.userRepository.create(userData);
    const token = sign({id: newUser.id, role: newUser.role}, process.env.JWT_SECRET as string, {expiresIn: '60'});
    return {token};
  }

  // Login Method
  @post('/login', {
    responses: {
      '200': {
        description: 'User Login',
        content: {'application/json': {schema: {'x-ts-type': User}}},
      },
    },
  })
  async login(
    @requestBody() credentials: {email: string; password: string},
  ) {
    const user = await this.userRepository.findOne({where: {email: credentials.email}});
    if (!user) throw new HttpErrors.Unauthorized('Invalid email or password');

    const passwordMatch = await compare(credentials.password, user.password);
    if (!passwordMatch) throw new HttpErrors.Unauthorized('Invalid email or password');

    const token = sign({id: user.id, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
    return {token};
  }
}
