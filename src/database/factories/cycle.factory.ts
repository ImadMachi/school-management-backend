import { Cycle } from 'src/cycles/entities/cycle.entity';
import { setSeederFactory } from 'typeorm-extension';

const cycleFactory = setSeederFactory(Cycle, (faker) => {
  const cycles = new Cycle();
  cycles.name = faker.lorem.word();
  return cycles;
});
export default cycleFactory;
