import { Entity } from "./entity.model";
import { Trip } from "./trip.model";

export class FavouriteTrips extends Entity {

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    private reference!: string;
    private trips!: Trip[];

    public getReference(): string {
        return this.reference;
    }

    public setReference(reference: string): void {
        this.reference = reference;
    }

    public getTrips(): Trip[] {
        return this.trips;
    }

    public setTrips(trips: Trip[]): void {
        this.trips = trips;
    }

}
