import { Parent } from 'src/parents/entities/parent.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames,arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const parentFactory = setSeederFactory(Parent, (faker) => {
  const parent = new Parent();
  parent.firstName = getRandomElement(arabicFirstNames);
  parent.lastName = getRandomElement(arabicLastNames);  
  parent.phoneNumber = faker.phone.number();
  return parent;
});

export default parentFactory;
