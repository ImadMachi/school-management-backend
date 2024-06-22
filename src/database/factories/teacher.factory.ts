import { Teacher } from '../../teachers/entities/teacher.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames, arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const teacherFactory = setSeederFactory(Teacher, (faker) => {
  const teacher = new Teacher();
  teacher.firstName = getRandomElement(arabicFirstNames);
  teacher.lastName = getRandomElement(arabicLastNames);
  teacher.phoneNumber = faker.phone.number();
  teacher.dateOfBirth = faker.date.past(20);
  teacher.dateOfEmployment = faker.date.past(10);
  teacher.sex = faker.helpers.arrayElement(['mâle', 'femelle']);
  return teacher;
});

export default teacherFactory;
