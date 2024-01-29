import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/guards/policies.guard';
import { Message } from 'src/messages/entities/message.entity';

export class ManageMessagesPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Message);
  }
}
