import { User } from '../../users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';



const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.firstName = faker.person.firstName('male');
  user.lastName = faker.person.lastName('male');
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
    provider: 'gmail',
  });
  user.password = faker.internet.password();

  return user;
});

export default userFactory;

 