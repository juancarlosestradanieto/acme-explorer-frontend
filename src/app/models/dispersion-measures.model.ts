import { Entity } from "./entity.model";

export class DispersionMeasures extends Entity{

    private average!: number;
    private minimum!: number;
    private maximum!: number;
    private standardDeviation!: number;

    constructor(obj: any) 
    {
      super();
      obj && Object.assign(this, obj);
    }

    public getAverage(): number 
    {
      return this.average;
    }
  
    public setAverage(average: number): void 
    {
      this.average = average;
    }

    public getMinimum(): number 
    {
      return this.minimum;
    }
  
    public setMinimum(minimum: number): void 
    {
      this.minimum = minimum;
    }

    public getMaximum(): number 
    {
      return this.maximum;
    }
  
    public setMaximum(maximum: number): void 
    {
      this.maximum = maximum;
    }

    public getStandardDeviation(): number 
    {
      return this.standardDeviation;
    }
  
    public setStandardDeviation(standardDeviation: number): void 
    {
      this.standardDeviation = standardDeviation;
    }
}
