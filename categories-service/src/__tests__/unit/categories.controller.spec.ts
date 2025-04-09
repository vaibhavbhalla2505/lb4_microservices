import {expect, createStubInstance,StubbedInstanceWithSinonAccessor} from '@loopback/testlab';
import sinon from 'sinon';
import {CategoriesController} from '../../controllers';
import {CategoriesRepository} from '../../repositories';
import {Categories} from '../../models';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;
  let repoStub: StubbedInstanceWithSinonAccessor<CategoriesRepository>;

  const sampleCategory = new Categories({
    id: 1,
    genre: 'Science',
  });

  beforeEach(() => {
    repoStub = createStubInstance(CategoriesRepository);
    controller = new CategoriesController(repoStub);
  });

  it('should create a category', async () => {
    const newCategory=new Categories({genre:'Science'})

    repoStub.stubs.create.resolves(sampleCategory);

    const result = await controller.create(newCategory);

    expect(result).to.eql(sampleCategory);
  });

  it('should return count of categories', async () => {
    repoStub.stubs.count.resolves({count: 1});
    const result = await controller.count();
    expect(result.count).to.equal(1);
  });

  it('should return list of categories', async () => {
    repoStub.stubs.find.resolves([sampleCategory]);
    const result = await controller.find();
    expect(result).to.eql([sampleCategory]);
  });

  it('should return a category by id', async () => {
    repoStub.stubs.findById.resolves(sampleCategory);
    const result = await controller.findById(1);
    expect(result).to.eql(sampleCategory);
  });

  it('should update multiple categories', async () => {
    const updateData = new Categories({genre: 'New Name'});
  
    repoStub.stubs.updateAll.resolves({count: 1});
  
    const result = await controller.updateAll(updateData, {genre: 'fiction'});
  
    expect(result.count).to.equal(1);
  });

  it('should patch a category by id', async () => {
    const updatedCategory = new Categories({genre: 'Updated Name'});

    repoStub.stubs.updateById.resolves();

    await controller.updateById(1, updatedCategory);

    sinon.assert.calledWith(repoStub.stubs.updateById, 1,updatedCategory);
  });

  it('should replace a category by id', async () => {
    repoStub.stubs.replaceById.resolves();
    await controller.replaceById(1, sampleCategory);
    sinon.assert.calledWith(repoStub.stubs.replaceById, 1, sampleCategory);
  });

  it('should delete a category by id', async () => {
    repoStub.stubs.deleteById.resolves();
    await controller.deleteById(1);
    sinon.assert.calledWith(repoStub.stubs.deleteById, 1);
  });
});
