import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { RoleName } from '../../auth/enums/RoleName';
import { Role } from '../../roles/entities/role.entity';
import { Message } from '../../messages/entities/message.entity';
import { MessageCategory } from '../../message-categories/entities/message-category.entity';

export default class AppSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    // Factories
    const administratorFactory = await factoryManager.get(Administrator);
    const teacherFactory = await factoryManager.get(Teacher);
    const studentFactory = await factoryManager.get(Student);
    const parentFactory = await factoryManager.get(Parent);
    const userFactory = await factoryManager.get(User);
    const roleFactory = await factoryManager.get(Role);
    const messageFactory = await factoryManager.get(Message);
    const messageCategoryFactory = await factoryManager.get(MessageCategory);

    // Persons
    const parents = await parentFactory.saveMany(5);
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
    const parentRole = await roleFactory.save({ name: RoleName.Parent });

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

    const userDirectorAdmin = await userFactory.save({
      email: 'admin@gmail.com',
      password: '123456',
      role: directorRole,
      administrator: administrators[2],
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

    const userStudent1 = await userFactory.save({
      email: `${students[0].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: studentRole,
      student: students[0],
    });
    const userStudent2 = await userFactory.save({
      email: `${students[1].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: studentRole,
      student: students[1],
    });

    const userParent = await userFactory.save({
      email :`${parents[0].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: parentRole,
      parent: parents[0],
    })

    // Message Categories
    const messageCategory1 = await messageCategoryFactory.save({
      name: 'Academique',
      imagepath: 'academic.jpg',
    });

    const messageCategory2 = await messageCategoryFactory.save({
      name: 'Announcement',
      imagepath: 'announcement.jpeg',
    });

    const messageCategory3 = await messageCategoryFactory.save({
      name: 'Evenement',
      imagepath: 'event.png',
    });

    const messageCategory4 = await messageCategoryFactory.save({
      name: 'Devoir',
      imagepath: 'homework.jpg',
    });

    const messageCategory5 = await messageCategoryFactory.save({
      name: 'Voyage scolaire',
      imagepath: 'school-trips-managers.jpg',
    });

    // Messages
    const messagesSentByDirector = await messageFactory.saveMany(3, {
      sender: userDirector,
      recipients: [userStudent1, userStudent2],
      category: messageCategory1,
    });

    const messagesSentByTeacher = await messageFactory.saveMany(3, {
      sender: userTeacher,
      recipients: [userStudent1, userStudent2],
      category: messageCategory2,
    });

    const starredMessagesByStudent1 = await messageFactory.saveMany(2, {
      sender: userTeacher,
      recipients: [userStudent1, userDirector],
      starredBy: [userStudent1, userDirector],
      category: messageCategory3,
    });

    const starredMessagesByStudent2 = await messageFactory.saveMany(2, {
      sender: userTeacher,
      recipients: [userStudent2, userDirector],
      starredBy: [userStudent2],
      category: messageCategory4,
    });
    const starredMessagesByParent = await messageFactory.saveMany(2, {
      sender: userParent,
      recipients: [userParent, userDirector],
      starredBy: [userParent],
      category: messageCategory5,
    });


  }
}
