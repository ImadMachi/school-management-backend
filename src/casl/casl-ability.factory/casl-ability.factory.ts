import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Administrator } from 'src/administrators/entities/administrator.entity';
import { RoleName } from 'src/auth/enums/RoleName';
import { User } from 'src/users/entities/user.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Message } from 'src/messages/entities/message.entity';
import { MessageCategory } from 'src/message-categories/entities/message-category.entity';
import { Student } from 'src/students/entities/student.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Director } from 'src/director/entities/director.entity';

type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Director
      | typeof Administrator
      | typeof Teacher
      | typeof Student
      | typeof Parent
      | typeof Message
      | typeof MessageCategory
    >
  | 'all';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (user.role.name === RoleName.Director) {
      can(Action.Manage, 'all');
    } else if (user.role.name === RoleName.Teacher) {
      can(Action.Read, MessageCategory);
    }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
