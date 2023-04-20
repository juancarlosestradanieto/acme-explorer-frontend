import { Entity } from "./entity.model";

export class SystemParameters extends Entity {

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    private maxFinderResults!: number;
    private flatRateSponsorships!: number;
    private cacheHour!: number;

    public getMaxFinderResults(): number {
        return this.maxFinderResults;
    }

    public setMaxFinderResults(maxFinderResults: number): void {
        this.maxFinderResults = maxFinderResults;
    }

    public getFlatRateSponsorships(): number {
        return this.flatRateSponsorships;
    }

    public setFlatRateSponsorships(flatRateSponsorships: number): void {
        this.flatRateSponsorships = flatRateSponsorships;
    }

    public getCacheHour(): number {
        return this.cacheHour;
    }

    public setCacheHour(cacheHour: number): void {
        this.cacheHour = cacheHour;
    }

}
