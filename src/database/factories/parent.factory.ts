import { Parent } from 'src/parents/entities/parent.entity';
import { setSeederFactory } from 'typeorm-extension';

const parentFactory = setSeederFactory(Parent, (faker) => {
  const parent = new Parent();
  parent.firstName = faker.person.firstName('male');
  parent.lastName = faker.person.lastName('male');
  parent.phoneNumber = faker.phone.number();
  return parent;
});

export default parentFactory;
