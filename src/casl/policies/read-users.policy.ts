import { User } from 'src/users/entities/user.entity';
import {
  Action,
  AppAbility,
} from '../casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from '../guards/policies.guard';

export class ReadUsersPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, User);
  }
}
