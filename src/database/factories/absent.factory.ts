import { getRandomValues } from "crypto";
import { Absent } from "src/absent/entities/absent.entity";
import { setSeederFactory } from 'typeorm-extension';

const absentFactory = setSeederFactory(Absent, (faker) => {

  const absent = new Absent();
  absent.datedebut = faker.date.anytime();
  absent.datefin = faker.date.anytime();
  absent.reason = faker.lorem.sentence();
  absent.justified = faker.datatype.boolean();
  absent.title = faker.lorem.sentence();
  absent.body = faker.lorem.paragraph();
  return absent;
  
});

export default absentFactory;
