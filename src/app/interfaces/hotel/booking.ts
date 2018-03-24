import {Room} from "./room";
import {User} from "../user";

export interface Booking {

    _id: String,
    event: String,
    bookedBy: User,
    totalCost: Number,
    roomType: String,
    rooms: Room[]

}
