import { Teacher } from '../../teachers/entities/teacher.entity';
import { setSeederFactory } from 'typeorm-extension';

const teacherFactory = setSeederFactory(Teacher, (faker) => {
  const teacher = new Teacher();
  teacher.firstName = faker.person.firstName('male');
  teacher.lastName = faker.person.lastName('male');
  teacher.phoneNumber = faker.phone.number();
  teacher.dateOfBirth = faker.date.past(20);
  teacher.dateOfEmployment = faker.date.past(10);
  teacher.sex = faker.helpers.arrayElement(['mâle', 'femelle']);
  return teacher;
});

export default teacherFactory;
