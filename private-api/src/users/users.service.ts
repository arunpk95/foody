import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll(skip = 0, take = 25) {
    return this.usersRepository.find({
      skip,
      take,
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOneOrFail(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update({ id }, updateUserDto);
    return this.usersRepository.findOneOrFail(id);
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }

  findMostConsumedNutrient(id: number) {
    return this.usersRepository.createQueryBuilder('user')
      .innerJoinAndMapOne("user_food", "user_foods","user_food",'user_food.user_id=user.id')
      .innerJoinAndMapOne("food_nutrient","food_nutrients","food_nutrient","food_nutrient.food_id=user_food.food_id")
      .innerJoinAndMapOne("nutrient","nutrients","nutrient","nutrient.id=food_nutrient.nutrient_id")
      .where("user.id = :id", { id: id })
      .select(['nutrient.id AS id', 'nutrient.name AS name', 'nutrient.unit_name AS unitName', 'SUM(user_food.servings_per_week * food_nutrient.amount_per_serving) AS weeklyAmount'])
      .groupBy("nutrient.id")
      .orderBy('weeklyAmount', 'DESC').
      getRawOne();
  }
}
