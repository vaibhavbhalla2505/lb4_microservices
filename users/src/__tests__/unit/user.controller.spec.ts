import {expect,StubbedInstanceWithSinonAccessor,createStubInstance} from '@loopback/testlab';
import sinon from 'sinon';
import {UserController} from '../../controllers/user.controller';
import {UserRepository} from '../../repositories';
import {User} from '../../models';

describe('UserController (Unit)', () => {
  let userRepoStub: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userController: UserController;

  const sampleUsers: User[] = [
    new User({id: 1, email: 'user1@example.com', password: 'pass', role: 'user'}),
    new User({id: 2, email: 'user2@example.com', password: 'pass', role: 'admin'}),
  ];

  beforeEach(() => {
    userRepoStub = createStubInstance(UserRepository);
    userController = new UserController(userRepoStub);
  });


  describe('get all the users', () => {
    it('should return an array of users', async () => {
      userRepoStub.stubs.find.resolves(sampleUsers);

      const result = await userController.find();

      expect(result).to.deepEqual(sampleUsers);
      sinon.assert.calledOnce(userRepoStub.stubs.find);
    });

    it('should call find with filter', async () => {
      const filter = {where: {role: 'admin'}};
      userRepoStub.stubs.find.resolves([sampleUsers[1]]);

      const result = await userController.find(filter);

      expect(result).to.deepEqual([sampleUsers[1]]);
      sinon.assert.calledWith(userRepoStub.stubs.find, filter);
    });
  });

  describe('deleteById()', () => {
    it('should call deleteById with correct id', async () => {
      userRepoStub.stubs.deleteById.resolves();

      await userController.deleteById(1);

      sinon.assert.calledOnceWithExactly(userRepoStub.stubs.deleteById, 1);
    });
  });
});
