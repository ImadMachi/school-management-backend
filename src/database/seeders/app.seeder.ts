import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { RoleName } from '../../auth/enums/RoleName';
import { Role } from '../../roles/entities/role.entity';

export default class AppSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    // Factories
    const administratorFactory = await factoryManager.get(Administrator);
    const teacherFactory = await factoryManager.get(Teacher);
    const studentFactory = await factoryManager.get(Student);
    const userFactory = await factoryManager.get(User);
    const roleFactory = await factoryManager.get(Role);

    // Persons
    const teachers = await teacherFactory.saveMany(5);
    const students = await studentFactory.saveMany(5);
    const administrators = await administratorFactory.saveMany(5);
    // Roles
    const directorRole = await roleFactory.save({ name: RoleName.Director });
    const administratorRole = await roleFactory.save({
      name: RoleName.Administrator,
    });
    const teacherRole = await roleFactory.save({ name: RoleName.Teacher });
    const studentRole = await roleFactory.save({ name: RoleName.Student });

    const customAdministrator1 = await administratorFactory.save({
      firstName: 'Imad',
      lastName: 'Machi',
    });

    const customAdministrator2 = await administratorFactory.save({
      firstName: 'Achraf',
      lastName: 'Kharbab',
    });

    // Users
    const userDirector = await userFactory.save({
      email: 'imadoxmachi@gmail.com',
      password: '123456',
      role: directorRole,
      administrator: administrators[0],
    });

    const userAdministrator = await userFactory.save({
      email: `${administrators[1].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: administratorRole,
      administrator: administrators[1],
    });

    const userTeacher = await userFactory.save({
      email: `${teachers[0].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: teacherRole,
      teacher: teachers[0],
    });

    const userStudent = await userFactory.save({
      email: `${students[0].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: studentRole,
      student: students[0],
    });
  }
}
