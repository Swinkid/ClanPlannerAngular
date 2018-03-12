import {Room} from "./room";

export interface Booking {

    _id: String,
    event: String,
    booking: {
        bookedBy: String,
        totalCost: number,
        rooms: Room[]
    },


}
