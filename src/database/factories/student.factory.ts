import { Student } from '../../students/entities/student.entity';
import { setSeederFactory } from 'typeorm-extension';

const roleFactory = setSeederFactory(Student, (faker) => {
  const student = new Student();
  student.firstName = faker.person.firstName('male');
  student.lastName = faker.person.lastName('male');
  return student;
});

export default roleFactory;
