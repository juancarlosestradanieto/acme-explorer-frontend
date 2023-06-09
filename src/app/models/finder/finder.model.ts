import { Entity } from '../entity.model';

export class Finder extends Entity {

    constructor(obj: any) 
    {
      super();
      obj && Object.assign(this, obj);
    }

    public keyWord!: string;
    public priceLowerBound!: number;
    public priceUpperBound!: number;
    public dateLowerBound!: Date;
    public dateUpperBound!: Date;
    public results!: Array<any>;
    public explorer_Id!: string;
    public expiration_date!: Date;

    public getKeyWord(): string {
        return this.keyWord!;
    }

    public setKeyWord(keyWord: string): void {
        this.keyWord = keyWord!;
    }

    public getPriceLowerBound(): number {
        return this.priceLowerBound!;
    }

    public setPriceLowerBound(priceLowerBound: number): void {
        this.priceLowerBound = priceLowerBound!;
    }

    public getPriceUpperBound(): number {
        return this.priceUpperBound!;
    }

    public setPriceUpperBound(priceUpperBound: number): void {
        this.priceUpperBound = priceUpperBound!;
    }

    public getDateLowerBound(): Date {
        return this.dateLowerBound!;
    }

    public setDateLowerBound(dateLowerBound: Date): void {
        this.dateLowerBound = dateLowerBound!;
    }

    public getDateUpperBound(): Date {
        return this.dateUpperBound!;
    }

    public setDateUpperBound(dateUpperBound: Date): void {
        this.dateUpperBound = dateUpperBound!;
    }

    public getResults(): Array<any> {
        return this.results;
    }

    public setResults(results: Array<any>): void {
        this.results = results;
    }

    public getExplorer_Id(): string {
        return this.explorer_Id!;
    }

    public setExplorer_Id(explorer_Id: string): void {
        this.explorer_Id = explorer_Id!;
    }

    public getExpiration_date(): Date {
        return this.expiration_date!;
    }

    public setExpiration_date(expiration_date: Date): void {
        this.expiration_date = expiration_date!;
    }

    public static castJsonFinder(json_finder: any): Finder
    {
        let casted_finder = new Finder(json_finder);
        return casted_finder;
    }

    public static castJsonFinders(json_finders: any): Array<Finder>
    {
        let casted_finders: Array<Finder> = json_finders.map((json_finder: any) => {
            return Finder.castJsonFinder(json_finder);
        });
        return casted_finders;
    }

    public getDateLowerBoundStringYmd(): string {
        let dateLowerBoundString = "";
        if(this.getDateLowerBound() != null)
        {
            dateLowerBoundString = (new Date(this.getDateLowerBound())).toLocaleDateString('en-CA');
        }
        return dateLowerBoundString;
    }

    public getDateUpperBoundStringYmd(): string {
        let dateUpperBoundString = "";
        if(this.getDateUpperBound() != null)
        {
            dateUpperBoundString = (new Date(this.getDateUpperBound())).toLocaleDateString('en-CA');
        }
        return dateUpperBoundString;
    }

}
