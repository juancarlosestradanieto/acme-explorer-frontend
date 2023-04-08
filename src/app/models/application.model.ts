import { Entity } from './entity.model';

export class Application extends Entity {
    private _moment!: Date;

    private _status!: string;

    private _comments!: string[];

    private _explorer_Id!: string;

    private _trip_Id!: string;

    private _rejection_reason!: string;

    constructor() {
        super();
    }

    public get moment(): Date {
        return this._moment;
    }

    public set moment(value: Date) {
        this._moment = value;
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

    public get rejection_reason(): string {
        return this._rejection_reason;
    }
    
    public set rejection_reason(value: string) {
        this._rejection_reason = value;
    }
}
