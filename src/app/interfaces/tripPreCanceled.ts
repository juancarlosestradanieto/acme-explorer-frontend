import { Stage } from "../models/stage.model"
import { TripPicture } from "../models/trip-picture.model"

export interface tripPreCanceled{
    id : string
      title: string
      description: string
      price: number
      requirements: string[],
      startDate: Date,
      endDate: Date,
      publicationDate: Date,
      pictures:TripPicture[],
      canceled:boolean,
      cancelReason:string,
      stages: Stage[],
      managerId: string
}