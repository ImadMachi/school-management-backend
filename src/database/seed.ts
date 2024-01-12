import { DataSource, DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';

const seedDatasourceOptions: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  seeds: [UserSeeder],
};

const seedDataSource = new DataSource(seedDatasourceOptions);

seedDataSource.initialize().then(async () => {
  await seedDataSource.synchronize(true);
  await runSeeders(seedDataSource);
  process.exit();
});
