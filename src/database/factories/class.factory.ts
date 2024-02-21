import { Class } from 'src/classes/entities/class.entity';
import { setSeederFactory } from 'typeorm-extension';

const classFactory = setSeederFactory(Class, (faker) => {
  const cls = new Class();
  cls.name = faker.lorem.word();
  cls.schoolYear = '2023-2024';
  return cls;
});

export default classFactory;
