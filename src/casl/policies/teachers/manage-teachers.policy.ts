import { Teacher } from "src/teachers/entities/teacher.entity";
import { Action, AppAbility } from "src/casl/casl-ability.factory/casl-ability.factory";
import { IPolicyHandler } from "src/casl/guards/policies.guard";

export class ManageTeachersPolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility): boolean {
        return ability.can(Action.Manage, Teacher)
    }
}