import { User } from '../../users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  return user;
});

export default userFactory;
