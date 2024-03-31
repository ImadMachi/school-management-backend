import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import generateSlug from 'src/common/utils/generate-slug.util';
import { User } from '../../users/entities/user.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { RoleName } from '../../auth/enums/RoleName';
import { Role } from '../../roles/entities/role.entity';
import { Message } from '../../messages/entities/message.entity';
import { MessageCategory } from '../../message-categories/entities/message-category.entity';
import { Director } from 'src/director/entities/director.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Attachment } from 'src/messages/entities/attachment.entity';
import { Template } from 'src/templates/entities/template.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Cycle } from 'src/cycles/entities/cycle.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Agent } from 'src/agent/entities/agent.entity';

export default class AppSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    // Factories
    const directorFactory = await factoryManager.get(Director);
    const administratorFactory = await factoryManager.get(Administrator);
    const teacherFactory = await factoryManager.get(Teacher);
    const studentFactory = await factoryManager.get(Student);
    const parentFactory = await factoryManager.get(Parent);
    const agentFactory = await factoryManager.get(Agent);
    const userFactory = await factoryManager.get(User);
    const roleFactory = await factoryManager.get(Role);
    const messageFactory = await factoryManager.get(Message);
    const templateFactory = await factoryManager.get(Template);
    const messageCategoryFactory = await factoryManager.get(MessageCategory);
    const classFactory = await factoryManager.get(Class);
    const levelFactory = await factoryManager.get(Level);
    const cycleFactory = await factoryManager.get(Cycle);
    const subjectFactory = await factoryManager.get(Subject);
    const attachmentFactory = await factoryManager.get(Attachment);

    // Persons
    const directors = await directorFactory.saveMany(5);
    const administrators = await administratorFactory.saveMany(5);
    const teachers = await teacherFactory.saveMany(5);
    const students = await studentFactory.saveMany(5);
    const parents = await parentFactory.saveMany(5);
    const agents = await agentFactory.saveMany(5);
    const customParent1 = await parentFactory.save({
      firstName: 'Ali',
      lastName: 'Lahlou',
    });
    const customAgent1 = await agentFactory.save({
      firstName: 'Ahmed',
      lastName: 'Mohsin',
    });
    const customStudent1 = await studentFactory.save({
      firstName: 'Ahmed',
      lastName: 'Lahlou',
      sex: 'mâle',
      parent: customParent1,
    });



    // Classes
    const classe1 = await classFactory.save({
      name: 'Classe 1',
      schoolYear: '2023-2024',
      teachers: [teachers[0], teachers[1]],
      students: [students[0], students[1], students[2], students[3], students[4]],
      administrator: administrators[0],
    });

    const classe2 = await classFactory.save({
      name: 'Classe 2',
      schoolYear: '2023-2024',
      teachers: [teachers[2], teachers[3]],
      students: [students[0], students[1], students[2], students[3], students[4]],
      administrator: administrators[1],
    });

    const classe3 = await classFactory.save({
      name: 'Classe 3',
      schoolYear: '2022-2023',
      teachers: [teachers[4]],
      students: [students[0], students[1], students[2], students[3], students[4]],
      administrator: administrators[2],
    });

    // Levels
    const level1 = await levelFactory.save({
      name: 'Level 1',
      schoolYear: '2023-2024',
      classes: [classe1, classe2],
    });

    const level2 = await levelFactory.save({
      name: 'Level 2',
      schoolYear: '2023-2024',
      classes: [classe3],
    });

    const level3 = await levelFactory.save({
      name: 'Level 3',
      schoolYear: '2022-2023',
      classes: [classe1, classe2, classe3],
    });

    //Cycles
    const cycle1 = await cycleFactory.save({
      name: 'Cycle A',
      schoolYear: '2022-2023',
      levels: [level1, level2, level3],
    });
    const cycle2 = await cycleFactory.save({
      name: 'Cycle B',
      schoolYear: '2022-2023',
      levels: [level2, level3],
    });
    const cycle3 = await cycleFactory.save({
      name: 'Cycle C',
      schoolYear: '2022-2023',
      levels: [level1, level3],
    });

    // Subjects

     const subject1 = await subjectFactory.save({
       name: 'French',
       teachers: [teachers[0], teachers[1]],
     });

    // const subject2 = await subjectFactory.save({
    //   name: ' English',
    //   teachers: [teachers[0], teachers[1]],
    //   classes: [classe1, classe3],
    // });


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
      director: directors[0],
    });

    const userAdministrator1 = await userFactory.save({
      email: `${administrators[0].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: administratorRole,
      administrator: administrators[0],
    });

    const userAdministrator2 = await userFactory.save({
      email: `${administrators[1].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: administratorRole,
      administrator: administrators[1],
    });

    const userAdministrator3 = await userFactory.save({
      email: `${administrators[2].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: administratorRole,
      administrator: administrators[2],
    });

    const userTeacher1 = await userFactory.save({
      email: `${teachers[0].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: teacherRole,
      teacher: teachers[0],
    });

    const userTeacher2 = await userFactory.save({
      email: `${teachers[1].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: teacherRole,
      teacher: teachers[1],
    });

    const userStudent1 = await userFactory.save({
      email: `${customStudent1.lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: studentRole,
      student: customStudent1,
    });
    const userStudent2 = await userFactory.save({
      email: `${students[1].lastName.toLowerCase()}@gmail.com`,
      password: '123456',
      role: studentRole,
      student: students[1],
    });

    const userParent1 = await userFactory.save({
      email: `${customParent1.lastName.toLowerCase()}.parent@gmail.com`,
      password: '123456',
      role: parentRole,
      parent: customParent1,
    });
    const userAgent1 = await userFactory.save({
      email: `${customAgent1.lastName.toLowerCase()}.agent@gmail.com`,
      password: '123456',
      role: agentRole,
    });

    // Message Categories
    const messageCategory1 = await messageCategoryFactory.save({
      name: 'Académique',
      slug: generateSlug('Academique'),
      imagepath: 'academic.jpg',
    });

    const messageCategory2 = await messageCategoryFactory.save({
      name: 'Annonce',
      slug: generateSlug('Announcement'),
      imagepath: 'announcement.jpeg',
    });

    const messageCategory3 = await messageCategoryFactory.save({
      name: 'Evénement',
      slug: generateSlug('Evenement'),
      imagepath: 'event.png',
    });

    const messageCategory4 = await messageCategoryFactory.save({
      name: 'Devoir',
      slug: generateSlug('Devoir'),
      imagepath: 'homework.jpg',
    });

    const messageCategory5 = await messageCategoryFactory.save({
      name: 'Voyage scolaire',
      slug: generateSlug('Voyage scolaire'),
      imagepath: 'school-trips-managers.jpg',
    });

    // Messages
    const message1 = await messageFactory.save({
      sender: userDirector1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory1,
      subject: 'Rentrée scolaire',
      body: 'La rentrée scolaire aura lieu le 15 mars 2023',
    });

    const message2 = await messageFactory.save({
      sender: userAdministrator1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory5,
      subject: 'Sortie scolaire',
      body: 'Sortie scolaire le 25 septembre 2021',
    });

    const message3 = await messageFactory.save({
      sender: userTeacher1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory4,
      subject: 'Devoir de mathématiques',
      body: 'Devoir de mathématiques pour le 20 septembre 2021',
    });
    const attachment3 = await attachmentFactory.save({
      filename: 'devoir-maths-1',
      filepath: 'devoir-math.jpg',
      message: message3,
    });
    const attachment3_1 = await attachmentFactory.save({
      filename: 'exercices de mathématiques',
      filepath: 'math-exercices.pdf',
      message: message3,
    });
    const attachment3_2 = await attachmentFactory.save({
      filename: 'devoir-maths-2',
      filepath: 'devoir-math-2.jpg',
      message: message3,
    });

    const message4 = await messageFactory.save({
      sender: userAdministrator1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory3,
      subject: "Fête de l'école",
      body: "Fête de l'école le 30 septembre 2021",
    });

    const message5 = await messageFactory.save({
      sender: userTeacher1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory2,
      subject: 'Annonce',
      body: 'Annonce importante, veuillez consulter les pièces jointes',
    });
    const attachment5 = await attachmentFactory.save({
      filename: 'annonce',
      filepath: 'annonce.png',
      message: message4,
    });

    const message6 = await messageFactory.save({
      sender: userParent1,
      recipients: [userDirector1],
      category: messageCategory2,
      subject: 'Demande de rendez-vous',
      body: 'Je souhaiterais avoir un rendez-vous avec vous',
    });

    const message7 = await messageFactory.save({
      sender: userStudent1,
      recipients: [userDirector1],
      category: messageCategory3,
      subject: 'Demande de details',
      body: 'Je souhaiterais avoir plus de details sur le voyage scolaire',
    });

    const message8 = await messageFactory.save({
      sender: userDirector1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory1,
      subject: 'Retoour de vacances',
      body: "J'espère que vous avez passé de bonnes vacances",
    });

    const message9 = await messageFactory.save({
      sender: userTeacher1,
      recipients: [userParent1],
      category: messageCategory4,
      subject: 'Demande de rendez-vous',
      body: 'Je souhaiterais avoir un rendez-vous avec vous',
    });

    const message10 = await messageFactory.save({
      sender: userTeacher1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory4,
      subject: 'Devoir de mathématiques',
      body: 'Devoir de mathématiques pour le 20 septembre 2023',
    });

    const message11 = await messageFactory.save({
      sender: userTeacher1,
      recipients: [userStudent1, userStudent2],
      category: messageCategory4,
      subject: 'Devoir de mathématiques',
      body: 'Devoir de mathématiques pour le 20 septembre 2023',
    });

    // Templates
    const template1 = await templateFactory.save({
      title: 'Rentrée scolaire',
      description: 'Rentrée scolaire',
      subject: 'Rentrée scolaire',
      body: 'La rentrée scolaire aura lieu le 15 mars 2023',
      category: messageCategory1,
    });

    const template2 = await templateFactory.save({
      title: 'Sortie scolaire',
      description: 'Sortie scolaire',
      subject: 'Sortie scolaire',
      body: 'Sortie scolaire le 25 septembre 2021',
      category: messageCategory5,
    });
  }
}
