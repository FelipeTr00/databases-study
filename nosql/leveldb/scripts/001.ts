import { db } from './db'

// PUT
db.put('chave1', 'Olá, LevelDB!')
  .then(() => console.log('Valor salvo com sucesso!'))
  .catch((err) => console.error('Erro ao salvar:', err));

// GET
db.get('chave1')
  .then((value) => console.log('Valor recuperado:', value))
  .catch((err) => console.error('Erro ao ler:', err));
