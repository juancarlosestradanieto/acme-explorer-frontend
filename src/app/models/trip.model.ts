//import { Sponsorship } from "./sponsorship";
import { Application } from "./application.model";
import { Entity } from "./entity.model";
import { Stage } from "./stage.model";

export class Trip extends Entity {

    constructor(obj: any) 
    {
        super();

        obj && Object.assign(this, obj);
    }

    private ticker!: string;
    private title!: string;
    private description!: string;
    private price!: number;
    private requirements!: string[];
    private startDate!: Date;
    private endDate!: Date;
    private publicationDate!: Date;
    private pictures!: string[];
    private canceled!: boolean;
    private cancelReason!: string;
    private stages!: Stage[];
    private managerId!: string;

    public getTicker(): string {
        return this.ticker;
    }

    public setTicker(ticker: string): void {
        this.ticker = ticker;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getDescription(): string {
        console.log("getDescription ", this.description);
        
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getPrice(): number {
        return this.price;
    }

    public setPrice(price: number): void {
        this.price = price;
    }

    public getRequirements(): string[] {
        return this.requirements;
    }

    public setRequirements(requirements: string[]): void {
        this.requirements = requirements;
    }

    public getStartDate(): Date {
        return this.startDate;
    }

    public setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }

    public setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }

    public getPublicationDate(): Date {
        return this.publicationDate;
    }

    public setPublicationDate(publicationDate: Date): void {
        this.publicationDate = publicationDate;
    }

    public getPictures(): string[] {
        return this.pictures;
    }

    public setPictures(pictures: string[]): void {
        this.pictures = pictures;
    }

    public isCanceled(): boolean {
        return this.canceled;
    }

    public setCanceled(canceled: boolean): void {
        this.canceled = canceled;
    }

    public getCancelReason(): string {
        return this.cancelReason;
    }

    public setCancelReason(cancelReason: string): void {
        this.cancelReason = cancelReason;
    }

    public getStages(): Stage[] {
        return this.stages;
    }

    public setStages(stages: Stage[]): void {
        this.stages = stages;
    }

    public getManagerId(): string {
        return this.managerId;
    }

    public setManagerId(managerId: string): void {
        this.managerId = managerId;
    }

    public static castJsonTrip(json_trip: any): Trip
    {
        let casted_trip = new Trip(json_trip);

        let json_stages = json_trip.stages;
        let casted_stages = json_stages.map((stage: any) => {
          return new Stage(stage);
        });
  
        casted_trip.setStages(casted_stages);
        return casted_trip;
    }

    public static castJsonTrips(json_trips: any): Array<Trip>
    {
        let casted_trips: Array<Trip> = json_trips.map((json_trip: any) => {
            return Trip.castJsonTrip(json_trip);
        });
        return casted_trips;
    }

}
