import { Entity } from './entity.model';

export class Application extends Entity {
    private _applicationMoment!: Date;

    private _status!: string;

    private _comments!: string[];

    private _explorer_Id!: string;

    private _trip_Id!: string;

    private _rejected_reason!: string;

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

    public get comments(): string[] {
        return this._comments;
    }

    public set comments(value: string[]) {
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

    public static castJsonApplication(json_trip: any): Application {
        let casted_application = new Application(json_trip);
        return casted_application;
    }

    public static castJsonApplications(json_applications: any): Array<Application> {
        let casted_applications: Array<Application> = json_applications.map((json_applications: any) => {
            return Application.castJsonApplication(json_applications);
        });
        return casted_applications;
    }
}
