import {Room} from "./room";
import {User} from "../user";

export interface Booking {

    _id: String,
    event: String,
    booking: {
        bookedBy: User,
        totalCost: number,
        roomType: String,
        rooms: Room[]
    },


}
