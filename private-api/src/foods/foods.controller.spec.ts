import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { Food } from './entities/food.entity';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';

describe('FoodsController', () => {
  let foodController: FoodsController;
  let foodService: FoodsService

  beforeEach(async () => {
    const FoodServiceProvider = {
      provide: FoodsService,

      useFactory: () => ({
        create: jest.fn(() => { return { "id": 167762, "description": "Strawberries, raw", "publicationDate": "2019-04-01T00:00:00.000Z" }; }),
        findAll: jest.fn(() => { return [{ "id": 16776, "description": "Watermelon, raw", "publicationDate": "2019-04-01T00:00:00.000Z" }] }),
        findOne: jest.fn(() => { return { "id": 167762, "description": "Strawberries, raw", "publicationDate": "2019-04-01T00:00:00.000Z" } }),
        update: jest.fn(() => { return { "id": 167762, "description": "Strawberries, smoothie", "publicationDate": "2019-04-01T00:00:00.000Z" }; }),
        remove: jest.fn(() => { return true}),
      })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsController],
      providers: [
        FoodsService,
        FoodServiceProvider,
      ],
    }).compile();

    foodController = module.get<FoodsController>(FoodsController);
    foodService = module.get<FoodsService>(FoodsService)
  });

  it('calling create food method', () => {
    //const dto = new CreateFoodDto();
    //expect(foodController.create(dto)).not.toEqual(null);
    expect(foodController.create({ "description": "Strawberries, raw", "publicationDate": "2019-04-01T00:00:00.000Z" }))
      .toEqual({ "id": 167762, "description": "Strawberries, raw", "publicationDate": "2019-04-01T00:00:00.000Z" })
  });


  it('testing find by keyword', () => {
    expect(foodController.findAll("WaterMelon, raw", 1, 10))
      .toEqual([{ "id": 16776, "description": "Watermelon, raw", "publicationDate": "2019-04-01T00:00:00.000Z" }]);
  });

  it('testing find by id', () => {
    expect(foodController.findOne(167762))
      .toEqual({ "id": 167762, "description": "Strawberries, raw", "publicationDate": "2019-04-01T00:00:00.000Z" });
  });

  it('testing update', async () => {
    //const dto = new CreateFoodDto();

    expect(await foodController.update(167762, { "description": "Strawberries, smoothie", "publicationDate": "2019-04-01T00:00:00.000Z" }))
      .toEqual({ "id": 167762, "description": "Strawberries, smoothie", "publicationDate": "2019-04-01T00:00:00.000Z" });
  });


  it('testing delete by id', () => {
    expect(typeof foodController.remove(10)).toEqual("object");
  });

});
