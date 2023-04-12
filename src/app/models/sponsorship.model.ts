import { Entity } from "./entity.model";

export class Sponsorship extends Entity {

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    private banner!: string[];
    private page!: string;
    private tripTicker!: string;
    private isPayed!: boolean;
    private sponsor_Id!: string;

    public getBanner(): string[] {
        return this.banner;
    }

    public setBanner(banner: string[]): void {
        this.banner = banner;
    }
    public getPage(): string {
        return this.page;
    }

    public setPage(page: string): void {
        this.page = page;
    }
    public getTripTicker(): string {
        return this.tripTicker;
    }

    public setTripTicker(tripTicker: string): void {
        this.tripTicker = tripTicker;
    }
    public getIsPayed(): boolean {
        return this.isPayed;
    }

    public setIsPayed(isPayed: boolean): void {
        this.isPayed = isPayed;
    }
    public getSponsor_Id(): string {
        return this.sponsor_Id;
    }

    public setSponsor_Id(issponsor_Id: string): void {
        this.sponsor_Id = issponsor_Id;
    }
}
