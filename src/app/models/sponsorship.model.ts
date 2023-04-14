import { Entity } from "./entity.model";

export class Sponsorship extends Entity {

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    public banner!: string[];
    public page!: string;
    public tripTicker!: string;
    public isPayed!: boolean;
    public sponsor_Id!: string;

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

    public setSponsor_Id(sponsor_Id: string): void {
        this.sponsor_Id = sponsor_Id;
    }

    public static castJsonSponsorship(json_sponsorship: any): Sponsorship {
        let casted_sponsorship = new Sponsorship(json_sponsorship);

        let json_banners = json_sponsorship.banner;
        console.log("json_banners", json_banners);
        if(json_banners != undefined) {
            let finishedBanners = false;
            let index = 0;
            let banner: string;
            let banners = [];
            while (!finishedBanners) {
                banner = json_banners[index];
                console.log("New banner", banner);
                if (banner != undefined) {
                    banners.push(banner);
                    console.log("Banners group",banners);
                    index++;
                } else {
                    finishedBanners = true;
                }
            }
    
            casted_sponsorship.setBanner(banners);
        } else {
            casted_sponsorship.setBanner([]);
        }



        return casted_sponsorship;
    }

    public static castJsonSponsorships(json_sponsorships: any): Array<Sponsorship> {
        let casted_sponsorships: Array<Sponsorship> = json_sponsorships.map((json_sponsorships: any) => {
            return Sponsorship.castJsonSponsorship(json_sponsorships);
        });
        return casted_sponsorships;
    }
}
