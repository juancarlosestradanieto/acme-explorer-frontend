import { Entity } from "./entity.model";

export class TripPicture extends Entity
{
    constructor(obj: any) 
    {
        super();
        obj && Object.assign(this, obj);
    }

    private picture!: string;

    public getPicture(): string {
        return this.picture!;
    }

    public setPicture(picture: string): void {
        this.picture! = picture!;
    }

}