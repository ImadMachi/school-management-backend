import { Parent } from 'src/parents/entities/parent.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames,arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const parentFactory = setSeederFactory(Parent, (faker) => {
  const parent = new Parent();
  parent.fatherFirstName = getRandomElement(arabicFirstNames);
  parent.fatherLastName = getRandomElement(arabicLastNames);  
  parent.fatherPhoneNumber = faker.phone.number();
  parent.motherFirstName = getRandomElement(arabicFirstNames);
  parent.motherLastName = getRandomElement(arabicLastNames);
  parent.motherPhoneNumber = faker.phone.number();
  parent.address = faker.address.streetAddress();
  return parent;
});

export default parentFactory;
