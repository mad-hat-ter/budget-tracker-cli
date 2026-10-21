export function LogMethod(_target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== "function") {
        throw new Error(`Декоратор LogMethod можно применять только к методам`);
    }
    descriptor.value = function (...args) {
        console.log(`Вызов метода ${String(propertyKey)} с аргументами:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Метод ${String(propertyKey)} вернул:`, result);
        return result;
    };
}
