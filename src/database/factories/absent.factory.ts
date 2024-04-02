import { getRandomValues } from "crypto";
import { Absent } from "src/absent/entities/absent.entity";
import { setSeederFactory } from 'typeorm-extension';

const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];


const getRandomHour = () => {
  const randomIndex = Math.floor(Math.random() * hours.length);
  return [hours[randomIndex]];
};


const absentFactory = setSeederFactory(Absent, (faker) => {



  const absent = new Absent();
  absent.day = faker.date.weekday();
  absent.hours = getRandomHour();
  absent.date = faker.date.anytime();
  absent.reason = faker.lorem.sentence();
  absent.justified = faker.datatype.boolean();
  absent.title = faker.lorem.sentence();
  absent.body = faker.lorem.paragraph();
  return absent;
});

export default absentFactory;
