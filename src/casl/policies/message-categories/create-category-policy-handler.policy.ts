import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/guards/policies.guard';
import { MessageCategory } from 'src/message-categories/entities/message-category.entity';

export class CreateMessageCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, MessageCategory);
  }
}
