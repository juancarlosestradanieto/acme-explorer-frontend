import { Entity } from "./entity.model";
import { Sponsorship } from "./sponsorship.model";

export class SponsorshipsResponse extends Entity {

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    private error!: boolean;
    private message!: string;
    private sponsorships!: Sponsorship[];

    public getError(): boolean {
        return this.error;
    }

    public setError(error: boolean): void {
        this.error = error;
    }

    public getMessage(): string {
        return this.message;
    }

    public setMessage(message: string): void {
        this.message = message;
    }

    public getSponsorships(): Sponsorship[] {
        return this.sponsorships;
    }

    public setSponsorships(sponsorships: Sponsorship[]): void {
        this.sponsorships = sponsorships;
    }
}
