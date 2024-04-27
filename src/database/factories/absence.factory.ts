import { Absence } from 'src/absences/entities/absence.entity';
import { setSeederFactory } from 'typeorm-extension';

const absenceFactory = setSeederFactory(Absence, (faker) => {
  const absence = new Absence();
  absence.startDate = faker.date.recent();
  absence.endDate = faker.date.future();
  absence.reason = faker.lorem.sentence();
  absence.status = faker.helpers.arrayElement(['not treated', 'treating', 'treated']);
  absence.absenceDays = [];
  return absence;
});

export default absenceFactory;
