import { Administrator } from '../../administrators/entities/administrator.entity';
import { setSeederFactory } from 'typeorm-extension';

const administratorFactory = setSeederFactory(Administrator, (faker) => {
  const administrator = new Administrator();
  administrator.firstName = faker.person.firstName('male');
  administrator.lastName = faker.person.lastName('male');
  administrator.phoneNumber = faker.phone.number();
  return administrator;
});

export default administratorFactory;
