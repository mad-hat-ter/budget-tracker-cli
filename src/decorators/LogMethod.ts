export function LogMethod(
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): void {
  const originalMethod = descriptor.value as
    | ((...args: unknown[]) => unknown)
    | undefined;

  if (typeof originalMethod !== "function") {
    throw new Error(`Декоратор LogMethod можно применять только к методам`);
  }

  descriptor.value = function (...args: unknown[]): unknown {
    console.log(`Вызов метода ${String(propertyKey)} с аргументами:`, args);

    const result: unknown = originalMethod.apply(this, args);

    console.log(`Метод ${String(propertyKey)} вернул:`, result);
    return result;
  };
}
