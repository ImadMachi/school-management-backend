import { Student } from '../../students/entities/student.entity';
import { setSeederFactory } from 'typeorm-extension';

const studentFactory = setSeederFactory(Student, (faker) => {
  const student = new Student();
  student.firstName = faker.person.firstName('male');
  student.lastName = faker.person.lastName('male');
  student.dateOfBirth = faker.date.past(20);
  student.sex = faker.helpers.arrayElement(['mâle', 'femelle']);
  return student;
});

export default studentFactory;
