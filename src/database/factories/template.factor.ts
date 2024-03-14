import { Template } from 'src/templates/entities/template.entity';
import { setSeederFactory } from 'typeorm-extension';

const templateFactory = setSeederFactory(Template, (faker) => {
  const template = new Template();
  template.title = faker.lorem.word();
  template.description = faker.lorem.sentence();
  template.subject = faker.lorem.sentence();
  template.body = faker.lorem.paragraph();
  return template;
});

export default templateFactory;
