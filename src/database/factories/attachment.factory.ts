import { Attachment } from 'src/messages/entities/attachment.entity';
import { setSeederFactory } from 'typeorm-extension';

const attachmentFactory = setSeederFactory(Attachment, (faker) => {
  const attachment = new Attachment();
  return attachment;
});

export default attachmentFactory;
