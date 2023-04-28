import { Entity } from './entity.model';

export class Application extends Entity {
    private _applicationMoment!: Date;

    private _status!: string;

    private _comments!: string[];

    private _explorer_Id!: string;

    private _trip_Id!: string;

    private _rejected_reason!: string;

    private _tripPrice!: number;

    constructor(obj: any) {
        super();
        obj && Object.assign(this, obj);
    }

    public get applicationMoment(): Date {
        return this._applicationMoment;
    }

    public set applicationMoment(value: Date) {
        this._applicationMoment = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        this._status = value;
    }

    public getComments(): string[] {
        return this._comments;
    }

    public setComments(value: string[]) {
        this._comments = value;
    }

    public get explorer_Id(): string {
        return this._explorer_Id;
    }

    public set explorer_Id(value: string) {
        this._explorer_Id = value;
    }

    public get trip_Id(): string {
        return this._trip_Id;
    }

    public set trip_Id(value: string) {
        this._trip_Id = value;
    }

    public get rejected_reason(): string {
        return this._rejected_reason;
    }

    public set rejected_reason(value: string) {
        this._rejected_reason = value;
    }

    public get tripPrice(): number {
        return this._tripPrice;
    }

    public set tripPrice(value: number) {
        this._tripPrice = value;
    }

    public static castJsonApplication(json_application: any): Application {
        let casted_application = new Application(json_application);

        //comments
        let json_comments = json_application.comments;
        let casted_comments = json_comments.split("[/||/]");
        casted_application.setComments(casted_comments);


        return casted_application;
    }

    public static castJsonApplications(json_applications: any): Array<Application> {
        let casted_applications: Array<Application> = json_applications.map((json_applications: any) => {
            return Application.castJsonApplication(json_applications);
        });
        return casted_applications;
    }
}
