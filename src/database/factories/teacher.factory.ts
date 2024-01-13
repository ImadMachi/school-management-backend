import { Teacher } from '../../teachers/entities/teacher.entity';
import { setSeederFactory } from 'typeorm-extension';

const roleFactory = setSeederFactory(Teacher, (faker) => {
  const teacher = new Teacher();
  teacher.firstName = faker.person.firstName('male');
  teacher.lastName = faker.person.lastName('male');
  teacher.phoneNumber = faker.phone.number();
  return teacher;
});

export default roleFactory;
