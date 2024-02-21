import { Administrator } from '../../administrators/entities/administrator.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames, arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
const administratorFactory = setSeederFactory(Administrator, (faker) => {
  const administrator = new Administrator();
  administrator.firstName = getRandomElement(arabicFirstNames);
  administrator.lastName = getRandomElement(arabicLastNames);
  administrator.phoneNumber = faker.phone.number();
  return administrator;
});

// Helper function to get a random element from an array

export default administratorFactory;
