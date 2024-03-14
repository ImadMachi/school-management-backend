import { Level } from 'src/levels/entities/level.entity';
import { setSeederFactory } from 'typeorm-extension';

const levelFactory = setSeederFactory(Level, (faker) => {
  const lvls = new Level();
  lvls.name = faker.lorem.word();
  lvls.schoolYear = '2023-2024';
  return lvls;
});

export default levelFactory;
