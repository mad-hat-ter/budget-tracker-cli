"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.GenericStorage = void 0;
class GenericStorage {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    removeById(id) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            return false;
        }
        this.items.splice(index, 1);
        return true;
    }
    getById(id) {
        return this.items.find((item) => item.id === id);
    }
    getAll() {
        return [...this.items];
    }
    describeAll() {
        for (const item of this.items) {
            if ("describe" in item && typeof item.describe === "function") {
                console.log(item.describe());
            }
            else {
                console.log(`Элемент id: ${item.id} не содержит описания.`);
            }
        }
    }
}
exports.GenericStorage = GenericStorage;
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    describe() {
        return `Product #${this.id}: ${this.name}, price: $${this.price}`;
    }
}
exports.Product = Product;
const productStorage = new GenericStorage();
productStorage.add(new Product(1, "Ноутбук", 150000));
productStorage.add(new Product(2, "Смартфон", 80000));
productStorage.add(new Product(3, "Планшет", 50000));
productStorage.add({ id: 4 });
console.log("--- Описание всех продуктов ---");
productStorage.describeAll();
