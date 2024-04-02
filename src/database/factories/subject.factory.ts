import { Subject } from 'src/subjects/entities/subject.entity';
import { setSeederFactory } from 'typeorm-extension';

const subjectFactory = setSeederFactory(Subject, (faker) => {
  const subjects = new Subject();
  subjects.name = faker.lorem.word()
  return subjects;
});

export default subjectFactory;
