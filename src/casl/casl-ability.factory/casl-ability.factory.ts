import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Administrator } from 'src/administrators/entities/administrator.entity';
import { RoleName } from 'src/auth/enums/RoleName';
import { User } from 'src/users/entities/user.entity';
import {Teacher} from 'src/teachers/entities/teacher.entity';

type Subjects = InferSubjects<typeof User | typeof Administrator | typeof Teacher> | 'all';

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
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role.name === RoleName.Director) {
      can(Action.Manage, 'all');
    }
    else if (user.role.name === RoleName.Teacher) {
      // can(Action.Create,'Message')
    }
  
  
    // if (user.isAdmin) {
    //   can(Action.Manage, 'all');
    // } else {
    //   can(Action.Read, 'all');
    // }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
