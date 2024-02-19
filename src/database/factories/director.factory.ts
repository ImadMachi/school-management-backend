import { Director } from 'src/director/entities/director.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames,arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const directorFactory = setSeederFactory(Director, (faker) => {
  const director = new Director();
  director.firstName = getRandomElement(arabicFirstNames);
  director.lastName = getRandomElement(arabicLastNames);
  director.phoneNumber = faker.phone.number();
  return director;
});

export default directorFactory;
