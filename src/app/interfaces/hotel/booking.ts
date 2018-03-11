import {Room} from "./room";

export interface Booking {

    event: String,
    booking: {
        bookedBy: String,
        totalCost: Number,
        rooms: Room[]
    },


}
