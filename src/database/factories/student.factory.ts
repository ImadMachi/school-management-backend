import { Student } from '../../students/entities/student.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames,arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const studentFactory = setSeederFactory(Student, (faker) => {
  const student = new Student();
  student.firstName = getRandomElement(arabicFirstNames);
  student.lastName = getRandomElement(arabicLastNames);
  student.dateOfBirth = faker.date.past(20);
  student.sex = faker.helpers.arrayElement(['mâle', 'femelle']);
  return student;
});

export default studentFactory;
