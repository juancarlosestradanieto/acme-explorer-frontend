import { Entity } from './entity.model';

export class Application extends Entity {
    private _moment!: Date;

    private _status!: string;

    private _comments!: string[];

    private _actor!: string;

    private _trip!: string;

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

    public get actor(): string {
        return this._actor;
    }

    public set actor(value: string) {
        this._actor = value;
    }

    public get trip(): string {
        return this._trip;
    }

    public set trip(value: string) {
        this._trip = value;
    }
}
