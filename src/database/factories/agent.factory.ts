import { Agent } from 'src/agent/entities/agent.entity';
import { setSeederFactory } from 'typeorm-extension';
import { arabicFirstNames,arabicLastNames } from '../dummyNames';

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const agentFactory = setSeederFactory(Agent, (faker) => {
  const agent = new Agent();
  agent.firstName = getRandomElement(arabicFirstNames);
  agent.lastName = getRandomElement(arabicLastNames);  
  agent.phoneNumber = faker.phone.number();
  return agent;
});

export default agentFactory;
