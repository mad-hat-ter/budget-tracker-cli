export function LogClass<T extends new (...args: any[]) => object>(
  constructor: T,
): T {
  return new Proxy(constructor, {
    construct(target, args, newTarget) {
      console.log(
        `Создан экземпляр класса ${target.name} с аргументами:`,
        args,
      );

      return Reflect.construct(target, args, newTarget);
    },
  });
}
