import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {sign} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {AuthController} from '../../controllers';
import {UserRepository} from '../../repositories';
import {User} from '../../models';
import jwt from 'jsonwebtoken'
describe('AuthControllerTesting', () => {
  let authController: AuthController;
  let userRepositoryStub: sinon.SinonStubbedInstance<UserRepository>;
  beforeEach(() => {
    userRepositoryStub = sinon.createStubInstance(
      UserRepository,
    ) as sinon.SinonStubbedInstance<UserRepository>;
    authController = new AuthController(userRepositoryStub);
  });
  it('should return a token for successfully login with valid credentials', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
    });

    const credentials = {
      email: 'test@example.com',
      password: 'testpassword',
    };
    
    const validPassword = true;
    
    userRepositoryStub.findOne.resolves(user);
    
    sinon.stub(bcrypt, 'compare').resolves(validPassword);
    
    const token = sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      },
    );

    const result = await authController.login(credentials);
    expect(result.token).to.equal(token);
    sinon.assert.calledOnce(userRepositoryStub.findOne);
  });

  it('should return a token for successful signup', async () => {
    const userData = new User({
      username: 'newuser',
      email: 'new@example.com',
      password: 'plaintextpassword',
      role: 'admin',
    });
  
    const hashPassword = 'hashedPassword';
    const expectedToken = 'mocked.jwt.token';
  
    userRepositoryStub.findOne.resolves(null);
    sinon.stub(bcrypt, 'hash').resolves(hashPassword);
  
    const savedUser = new User({
      ...userData,
      id: 1,
      password: hashPassword,
    });
  
    userRepositoryStub.create.resolves(savedUser);
    sinon.stub(jwt, 'sign').callsFake(()=>expectedToken);
  
    const result = await authController.signup(userData);
  
    expect(result.token).to.equal(expectedToken);
    sinon.assert.calledOnce(userRepositoryStub.create);
  });
  
});