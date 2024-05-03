import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import generateSlug from 'src/common/utils/generate-slug.util';
import { User } from '../../users/entities/user.entity';
import { RoleName } from '../../auth/enums/RoleName';
import { Role } from '../../roles/entities/role.entity';
import { MessageCategory } from '../../message-categories/entities/message-category.entity';
import { Director } from 'src/director/entities/director.entity';

export default class AppSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    // Factories
    const directorFactory = await factoryManager.get(Director);
    const userFactory = await factoryManager.get(User);
    const roleFactory = await factoryManager.get(Role);
    const messageCategoryFactory = await factoryManager.get(MessageCategory);

    // Persons
    const customDirector = await directorFactory.save({
      firstName: 'Admin',
      lastName: 'Admin',
      phoneNumber: '',
    });

    // Roles
    const directorRole = await roleFactory.save({ name: RoleName.Director });
    const administratorRole = await roleFactory.save({
      name: RoleName.Administrator,
    });
    const teacherRole = await roleFactory.save({ name: RoleName.Teacher });
    const studentRole = await roleFactory.save({ name: RoleName.Student });
    const parentRole = await roleFactory.save({ name: RoleName.Parent });
    const agentRole = await roleFactory.save({ name: RoleName.Agent });

    // Users
    const userDirector1 = await userFactory.save({
      email: 'admin@gmail.com',
      password: '123456',
      role: directorRole,
      director: customDirector,
    });

    // Message Categories
    const messageCategory1 = await messageCategoryFactory.save({
      name: 'Académique',
      slug: generateSlug('Academique'),
      imagepath: 'academic.jpg',
    });

    const messageCategory2 = await messageCategoryFactory.save({
      name: 'Absence',
      slug: generateSlug('Absence'),
      imagepath: 'absence.png',
    });
  }
}
