import { ApplicationsRatio } from "./applications-ratio.model";
import { DispersionMeasures } from "./dispersion-measures.model";
import { Entity } from "./entity.model";

export class Dashboard extends Entity{
    private tripsPerManager!: DispersionMeasures;
    private applicationsPerTrip!: DispersionMeasures;
    private priceOfTrips!: DispersionMeasures;
    private applicationsRatioPerStatus!: ApplicationsRatio[];
    private computationMoment!: Date;
    private privaterebuildPeriod!: string;

    constructor(obj: any) {
      super();
      obj && Object.assign(this, obj);
    }

    public getTripsPerManager(): DispersionMeasures {
        return this.tripsPerManager;
    }

    public setTripsPerManager(tripsPerManager: DispersionMeasures): void {
        this.tripsPerManager = tripsPerManager;
    }

    public getApplicationsPerTrip(): DispersionMeasures {
        return this.applicationsPerTrip;
    }

    public setApplicationsPerTrip(applicationsPerTrip: DispersionMeasures): void {
        this.applicationsPerTrip = applicationsPerTrip;
    }

    public getPriceOfTrips(): DispersionMeasures {
        return this.priceOfTrips;
    }

    public setPriceOfTrips(priceOfTrips: DispersionMeasures): void {
        this.priceOfTrips = priceOfTrips;
    }

    public getApplicationsRatioPerStatus(): ApplicationsRatio[] {
        return this.applicationsRatioPerStatus;
    }

    public setApplicationsRatioPerStatus(applicationsRatioPerStatus: ApplicationsRatio[]): void {
        this.applicationsRatioPerStatus = applicationsRatioPerStatus;
    }

    public getComputationMoment(): Date {
        return this.computationMoment;
    }

    public setComputationMoment(computationMoment: Date): void {
        this.computationMoment = computationMoment;
    }

    public getPrivaterebuildPeriod(): string {
        return this.privaterebuildPeriod;
    }

    public setPrivaterebuildPeriod(privaterebuildPeriod: string): void {
        this.privaterebuildPeriod = privaterebuildPeriod;
    }
  
}
