export function ReadOnly(target, propertyKey) {
    const values = new WeakMap();
    Object.defineProperty(target, propertyKey, {
        get() {
            return values.get(this);
        },
        set(value) {
            if (values.has(this)) {
                throw new Error(`Свойство ${String(propertyKey)} доступно только для чтения`);
            }
            values.set(this, value);
        },
        enumerable: true,
        configurable: true,
    });
}
