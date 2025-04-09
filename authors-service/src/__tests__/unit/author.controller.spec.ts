import {AuthorsController} from '../../controllers';
import { AuthorsRepository } from '../../repositories';
import {expect, createStubInstance,StubbedInstanceWithSinonAccessor} from '@loopback/testlab';
import sinon from 'sinon';
import { Authors } from '../../models';

describe('AuthorsController Unit Tests', () => {
  let controller: AuthorsController;

  const sampleAuthor = new Authors({id: 1, name: 'J.K. Rowling'});
  let repoStub:StubbedInstanceWithSinonAccessor<AuthorsRepository>
  beforeEach(() => {
    repoStub= createStubInstance(AuthorsRepository);
    controller = new AuthorsController(repoStub);
  });

  it('should create an author', async () => {
    const newAuthor = new Authors({name: 'J.K. Rowling'});
  
    repoStub.stubs.create.resolves(sampleAuthor);
  
    const result = await controller.create(newAuthor);
  
    expect(result).to.eql(sampleAuthor);
  });
  

  it('should return authors count', async () => {
    repoStub.stubs.count.resolves({count: 1});
    const result = await controller.count();
    expect(result.count).to.equal(1);
  });

  it('should return list of authors', async () => {
    repoStub.stubs.find.resolves([sampleAuthor]);
    const result = await controller.find();
    expect(result).to.eql([sampleAuthor]);
  });

  it('should update authors with given filter', async () => {
    const updateData = new Authors({name: 'New Name'});
  
    repoStub.stubs.updateAll.resolves({count: 1});
  
    const result = await controller.updateAll(updateData, {name: 'J.K. Rowling'});
  
    expect(result.count).to.equal(1);
  });
  

  it('should return author by ID', async () => {
    repoStub.stubs.findById.resolves(sampleAuthor);
    const result = await controller.findById(1);
    expect(result).to.eql(sampleAuthor);
  });

  it('should patch author by ID', async () => {
    const updatedAuthor = new Authors({name: 'Updated Name'});
  
    repoStub.stubs.updateById.resolves();
  
    await controller.updateById(1, updatedAuthor);
  
    sinon.assert.calledWith(repoStub.stubs.updateById, 1, updatedAuthor);
  });
  

  it('should replace author by ID', async () => {
    repoStub.stubs.replaceById.resolves();
    await controller.replaceById(1, sampleAuthor);
    sinon.assert.calledWith(repoStub.stubs.replaceById, 1, sampleAuthor);
  });

  it('should delete author by ID', async () => {
    repoStub.stubs.deleteById.resolves();
    await controller.deleteById(1);
    sinon.assert.calledWith(repoStub.stubs.deleteById, 1);
  });
});
