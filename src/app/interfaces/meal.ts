import {User} from "./user";
import {Event} from "./event";

export interface Meal {

    _id: String,
    user : User,
    event : Event,
    drivingNumberOfSeats:  Number,
    needsLift: Boolean,
    dietaryRequirements: String,
    passengers: User[]

}
