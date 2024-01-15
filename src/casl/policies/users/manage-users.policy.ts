import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/guards/policies.guard';
import { User } from 'src/users/entities/user.entity';

export class ManageUsersPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, User);
  }
}
