import { Entity } from "./entity.model";

export class Stage extends Entity {

    constructor() 
    {
        super();
    }

    private title!: string;
    private description!: string;
    private price!: number;

    public getTitle(): string {
        return this.title!;
    }

    public setTitle(title: string): void {
        this.title! = title!;
    }

    public getDescription(): string {
        return this.description!;
    }

    public setDescription(description: string): void {
        this.description! = description!;
    }

    public getPrice(): number {
        return this.price!;
    }

    public setPrice(price: number): void {
        this.price! = price!;
    }

}
