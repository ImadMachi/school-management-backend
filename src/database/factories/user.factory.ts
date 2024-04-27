import { User } from '../../users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { menProfileImages, womenProfileImages } from '../dummyUserImages';

const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.disabled = faker.datatype.boolean();
  const isMale = Math.random() < 0.5;
  if (user) {
    user.profileImage = isMale
      ? menProfileImages[Math.floor(Math.random() * menProfileImages.length)]
      : womenProfileImages[Math.floor(Math.random() * womenProfileImages.length)];
  }

  return user;
});

export default userFactory;
