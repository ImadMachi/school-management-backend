import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/guards/policies.guard';
import { Agent } from 'src/agent/entities/agent.entity';

export class ManageAgentsPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Agent);
  }
}
