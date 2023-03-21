import { Entity } from "./entity.model";

export class Stage extends Entity {
    private _title!: string;

    private _description!: string;

    private _price!: number;

    private _trip!: string;

    constructor() {
        super();
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get price(): number {
        return this._price;
    }

    public set price(value: number) {
        this._price = value;
    }

    public get trip(): string {
        return this._trip;
    }

    public set trip(value: string) {
        this._trip = value;
    }
}
