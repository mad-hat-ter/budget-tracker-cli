import "reflect-metadata";
export function Metadata(key, value) {
    return (target, propertyKey) => {
        Reflect.defineMetadata(key, value, target, propertyKey);
    };
}
