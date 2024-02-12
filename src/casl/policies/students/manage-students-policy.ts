import { Action, AppAbility } from "src/casl/casl-ability.factory/casl-ability.factory";
import { IPolicyHandler } from "src/casl/guards/policies.guard";
import { Student } from "src/students/entities/student.entity";

export class ManageStudentsPolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility): boolean {
        return ability.can(Action.Manage, Student)
    }
}