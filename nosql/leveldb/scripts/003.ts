import { getAllProducts } from "./004";
import { db } from "./db";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

class ProductModel {
  // 🔹 Método para obter o próximo ID autoincrementável
  private async getNextId(): Promise<string> {
    try {
      const lastId = await db.get("last_product_id");
      const newId = Number(lastId) + 1;
      await db.put("last_product_id", newId.toString());
      return newId.toString();
    } catch (error) {
      // Se a chave "last_product_id" não existir, iniciamos com 1
      await db.put("last_product_id", "1");
      return "1";
    }
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const id = await this.getNextId();
    const newProduct: Product = { id, ...product };

    await db.put(id, JSON.stringify(newProduct));
    console.log(`✅ Produto ${newProduct.name} salvo com ID ${newProduct.id}!`);
    return newProduct;
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const data = await db.get(id);
      return JSON.parse(data) as Product;
    } catch (error) {
      console.error(`❌ Produto não encontrado: ${id}`);
      return null;
    }
  }

  async getAllProducts(): Promise<any[]> {
    const products: any[] = [];

    for await (const [key, value] of db.iterator({
      keys: true,
      values: true,
    })) {
      if (key !== "last_product_id") {
        try {
          products.push(JSON.parse(value));
        } catch (error) {
          console.error(
            `⚠️ Erro ao processar a chave ${key}: Valor inválido no banco.`
          );
        }
      }
    }

    return products;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.del(id);
    console.log(`🗑️ Produto ${id} removido!`);
  }
}

async function main() {
  console.log("🚀 Inserindo 30 produtos no LevelDB:");

  const productModel = new ProductModel();

  const products = [
    { name: "Notebook Dell", price: 4500, category: "Eletrônicos" },
    { name: "Smartphone Samsung", price: 2500, category: "Eletrônicos" },
    { name: "Cadeira Gamer", price: 850, category: "Móveis" },
    { name: "Fone de Ouvido JBL", price: 300, category: "Áudio" },
    { name: "Teclado Mecânico", price: 350, category: "Periféricos" },
    { name: "Mouse Gamer", price: 250, category: "Periféricos" },
    { name: 'Monitor LG 27"', price: 1200, category: "Monitores" },
    { name: "HD Externo 1TB", price: 400, category: "Armazenamento" },
    { name: "SSD NVMe 1TB", price: 650, category: "Armazenamento" },
    { name: "Placa de Vídeo RTX 4060", price: 3200, category: "Hardware" },
    { name: "Processador Intel i7", price: 1800, category: "Hardware" },
    { name: "Memória RAM 16GB DDR4", price: 600, category: "Hardware" },
    { name: "Fonte 750W 80 Plus Gold", price: 550, category: "Hardware" },
    { name: "Gabinete Mid Tower", price: 450, category: "Gabinetes" },
    { name: "Impressora Multifuncional", price: 750, category: "Periféricos" },
    { name: "Webcam Full HD", price: 280, category: "Acessórios" },
    { name: "Microfone USB", price: 320, category: "Áudio" },
    { name: "Caixa de Som Bluetooth", price: 400, category: "Áudio" },
    {
      name: "Carregador Portátil 20000mAh",
      price: 250,
      category: "Acessórios",
    },
    { name: "Ventilador de Mesa", price: 180, category: "Eletrodomésticos" },
    { name: "Aspirador de Pó", price: 600, category: "Eletrodomésticos" },
    { name: "Cafeteira Expresso", price: 900, category: "Eletrodomésticos" },
    { name: "Relógio Inteligente", price: 1200, category: "Wearables" },
    { name: "Drone com Câmera", price: 1800, category: "Eletrônicos" },
    { name: "Console PlayStation 5", price: 4000, category: "Games" },
    { name: "Joystick Xbox Series", price: 350, category: "Games" },
    { name: "Torradeira Elétrica", price: 200, category: "Eletrodomésticos" },
    {
      name: "Liquidificador Industrial",
      price: 850,
      category: "Eletrodomésticos",
    },
    { name: "Fogão 5 Bocas", price: 1800, category: "Eletrodomésticos" },
    {
      name: "Máquina de Lavar 10kg",
      price: 2200,
      category: "Eletrodomésticos",
    },
  ];

  for (const product of products) {
    await productModel.createProduct(product);
  }

  console.log("✅ Todos os 30 produtos foram salvos no LevelDB!");
}

main();
getAllProducts();
