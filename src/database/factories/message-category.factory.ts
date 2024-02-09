import generateSlug from 'src/common/utils/generate-slug.util';
import { MessageCategory } from '../../message-categories/entities/message-category.entity';
import { setSeederFactory } from 'typeorm-extension';

const messageCategoryFactory = setSeederFactory(MessageCategory, (faker) => {
  const message = new MessageCategory();
  message.name = faker.lorem.word();
  message.slug = generateSlug(message.name);
  message.description = faker.lorem.sentence();
  return message;
});

export default messageCategoryFactory;
