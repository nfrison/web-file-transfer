interface Service<T>
{
    create(t: T): T | Error;

    readAll(): Array<T> | Error;

    update(t: T): void;

    delete(t: T): void;
}

export default Service;