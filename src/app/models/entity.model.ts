export class Entity {

    public _id: string;
    public _version: number;

    constructor()
    {
        this._id = '0';
        this._version = 0;
    }
    
    public get id(): string {
        return this._id;
    }
    
    public get version(): number {
        return this._version;
    }

    public set id(value: string) {
        this._id = value;
    }
    
}
