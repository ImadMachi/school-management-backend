import { Class } from 'src/classes/entities/class.entity';
import { setSeederFactory } from 'typeorm-extension';

const classFactory = setSeederFactory(Class, (faker) => {
  const cls = new Class();
  cls.name = faker.random.word();
  cls.startDate = faker.date.past();
  cls.endDate = faker.date.future();
  return cls;
});

export default classFactory;
