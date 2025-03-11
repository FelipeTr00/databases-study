import { db } from './db';

interface User {
  id: string;
  name: string;
  email: string;
}

class UserModel {
  async createUser(user: User): Promise<void> {
    await db.put(user.id, JSON.stringify(user));
    console.log(`Usuário ${user.name} salvo!`);
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const data = await db.get(id);
      return JSON.parse(data) as User;
    } catch (error) {
      console.error(`Usuário não encontrado: ${id}`);
      return null;
    }
  }

  async deleteUser(id: string): Promise<void> {
    await db.del(id);
    console.log(`Usuário ${id} removido!`);
  }
}

async function main() {
  console.log("Iniciando LevelDB.");

  const userModel = new UserModel();

  // Criar um novo usuário
  const newUser: User = {
    id: '000001',
    name: 'John Cena',
    email: 'john@wwe.com'
  };

  await userModel.createUser(newUser);

  // Buscar usuário
  const user = await userModel.getUser('user_001');
  console.log("Usuário encontrado:", user);

  // Deletar usuário
  await userModel.deleteUser('user_001');

  // Tentar buscar o usuário novamente
  const userNotFound = await userModel.getUser('user_001');
  console.log("Usuário após exclusão:", userNotFound);
}

main();
