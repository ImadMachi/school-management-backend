import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';



export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    
    const userFactory = await factoryManager.get(User);
    await userFactory.save({firstName:"Imad",lastName:"Machi", email: 'imadoxmachi@gmail.com',password:"123456"})

    await userFactory.saveMany(5);
  }
}

