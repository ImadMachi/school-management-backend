import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/guards/policies.guard';
import { Director } from 'src/director/entities/director.entity';

export class ManageDirectorsPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Director);
  }
}
