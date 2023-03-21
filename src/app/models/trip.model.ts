//import { Sponsorship } from "./sponsorship";
import { Application } from "./application.model";
import { Entity } from "./entity.model";
import { Stage } from "./stage.model";

export class Trip extends Entity {
    private _ticker!: string;

    private _title!: string;

    private _description!: string;

    private _price!: number;

    private _requirements!: string[];

    private _start_date!: Date;

    private _end_date!: Date;

    private _pictures!: string[];

    private _is_cancelled!: boolean;

    private _cancel_reason!: string;

    private _stages!: Stage[];

    private _applications: Application[] = [];

    private _manager!: string;

    //private _is_published: boolean;

    //private _sponsorships: Sponsorship[];

    constructor() {
        super();
      }

    public get ticker(): string {
        return this._ticker;
    }

    public set ticker(value: string) {
        this._ticker = value;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get price(): number {
        return this._price;
    }

    public set price(value: number) {
        this._price = value;
    }

    public get requirements(): string[] {
        return this._requirements;
    }

    public set requirements(value: string[]) {
        this._requirements = value;
    }

    public get start_date(): Date {
        return this._start_date;
    }

    public set start_date(value: Date) {
        this._start_date = value;
    }

    public get end_date(): Date {
        return this._end_date;
    }

    public set end_date(value: Date) {
        this._end_date = value;
    }

    public get pictures(): string[] {
        return this._pictures;
    }

    public set pictures(value: string[]) {
        this._pictures = value;
    }

    public get is_cancelled(): boolean {
        return this._is_cancelled;
    }

    public set is_cancelled(value: boolean) {
        this._is_cancelled = value;
    }

    public get cancel_reason(): string {
        return this._cancel_reason;
    }

    public set cancel_reason(value: string) {
        this._cancel_reason = value;
    }

    public get stages(): Stage[] {
        return this._stages;
    }
    
    public set stages(value: Stage[]) {
        this._stages = value;
    }

    public get applications(): Application[] {
        return this._applications;
    }
    
    public set applications(value: Application[]) {
        this._applications = value;
    }

    public get manager(): string {
        return this._manager;
    }
    
    public set manager(value: string) {
        this._manager = value;
    }

}
