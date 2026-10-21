export function LogClass(constructor) {
    return new Proxy(constructor, {
        construct(target, args, newTarget) {
            console.log(`Создан экземпляр класса ${target.name} с аргументами:`, args);
            return Reflect.construct(target, args, newTarget);
        },
    });
}
