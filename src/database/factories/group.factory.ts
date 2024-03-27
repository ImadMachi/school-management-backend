import { Group } from 'src/groups/entities/group.entity';
import { setSeederFactory } from 'typeorm-extension';

const groupFactory = setSeederFactory(Group, (faker) => {
  const group = new Group();
  group.name = faker.lorem.word();
  group.description = faker.lorem.sentence();
  return group;
});

export default groupFactory;
