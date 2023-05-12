import { Entity } from "./entity.model";
import { FavouriteTrips } from "./favourite-trips.model";

export class FavouriteLists extends Entity {
    
    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    private _explorer_Id!: string;
    private _favourite_trips!: FavouriteTrips[];
    
    public get explorer_Id(): string {
        return this._explorer_Id;
    }

    public set explorer_Id(value: string) {
        this._explorer_Id = value;
    }

    public get favourite_trips(): FavouriteTrips[] {
        return this._favourite_trips;
    }

    public set favourite_trips(value: FavouriteTrips[]) {
        this._favourite_trips = value;
    }
}
