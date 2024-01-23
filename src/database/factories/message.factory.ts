import { setSeederFactory } from 'typeorm-extension';
import { Message } from '../../messages/entities/message.entity';

const messageFactory = setSeederFactory(Message, (faker) => {
  const message = new Message();
  message.subject = faker.lorem.sentence();
  message.body = faker.lorem.paragraph();
  return message;
});

export default messageFactory;
