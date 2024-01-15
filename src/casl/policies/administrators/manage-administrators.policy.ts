import { Administrator } from 'src/administrators/entities/administrator.entity';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/guards/policies.guard';

export class ManageAdministratorsPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Administrator);
  }
}
