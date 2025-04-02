import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import { User } from '../models';
import {UserRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';

export class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      try {
        const userPayload = verify(token, process.env.JWT_SECRET as string) as User;
        const user = await this.userRepository.findById(userPayload.id);
        if (!user) throw new HttpErrors.Unauthorized('Invalid token');
        return user;
      } catch (error) {
        throw new HttpErrors.Unauthorized('Invalid or expired token');
      }
    };
  }
}
