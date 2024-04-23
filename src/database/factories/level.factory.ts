import { Level } from 'src/levels/entities/level.entity';
import { setSeederFactory } from 'typeorm-extension';

const levelFactory = setSeederFactory(Level, (faker) => {
  const lvls = new Level();
  lvls.name = faker.lorem.word();
  return lvls;
});

export default levelFactory;
