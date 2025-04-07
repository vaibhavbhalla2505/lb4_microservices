import {Provider} from '@loopback/context';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {HttpErrors} from '@loopback/rest';
import { UserSignUp } from '../interfaces/interface';
import { RolePermissions } from '../mappings/role-permission.map';
export class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      try {
        const userPayload = verify(token, process.env.JWT_SECRET as string) as UserSignUp;
        userPayload.permissions=RolePermissions[userPayload.role] || [];
        return userPayload;
      } catch (error) {
        throw new HttpErrors.Unauthorized('Invalid or expired token');
      }
    };
  }
}
