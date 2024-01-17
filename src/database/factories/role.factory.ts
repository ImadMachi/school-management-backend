import { Role } from '../../roles/entities/role.entity';
import { setSeederFactory } from 'typeorm-extension';

const roleFactory = setSeederFactory(Role, (faker) => {
  const role = new Role();
  return role;
});

export default roleFactory;
