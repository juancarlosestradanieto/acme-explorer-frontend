import { Entity } from "./entity.model";

export class ApplicationsRatio extends Entity {

    private status!: string;
    private ratio!: number;

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    public getRatio(): number {
        return this.ratio;
    }

    public setRatio(ratio: number): void {
        this.ratio = ratio;
    }
}
