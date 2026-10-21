import "reflect-metadata";

export function Metadata(key: string, value: unknown): PropertyDecorator {
  return (target, propertyKey): void => {
    Reflect.defineMetadata(key, value, target, propertyKey);
  };
}
