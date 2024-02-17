import { Director } from 'src/director/entities/director.entity';
import { setSeederFactory } from 'typeorm-extension';

const directorFactory = setSeederFactory(Director, (faker) => {
  const director = new Director();
  director.firstName = faker.person.firstName('male');
  director.lastName = faker.person.lastName('male');
  director.phoneNumber = faker.phone.number();
  return director;
});

export default directorFactory;
