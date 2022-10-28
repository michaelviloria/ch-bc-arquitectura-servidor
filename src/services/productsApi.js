import ProductsDao from "../DAO/products.js";
import { logger } from "../utils/apiLogs.js";

let instance = null;

class ProductsApi {
	constructor() {
		this.productsDao = ProductsDao.getInstance();
	}

	async getAll() {
		const response = await this.productsDao.getAll();
		return response;
	}

	async get(id) {
		const response = await this.productsDao.get(id);
		return response;
	}

	async addProduct(product) {
		await this.productsDao.addProduct(product);
		logger.info("Producto guardado.");
	}

	async update(id, product) {
		const response = await this.productsDao.update(id, product);
		return response;
	}

	async delete(id) {
		const response = await this.productsDao.delete(id);
		return response;
	}

	static getInstance() {
		if (!instance) instance = new ProductsApi();
		return instance;
	}
}

export default ProductsApi;
