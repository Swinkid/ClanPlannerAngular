import {User} from "./user";
import {Event} from "./event";

export interface Seat {

    _id: String,
    event: Event,
    user: User,
    onPicker : String,
    actualSeat : String,
    notes: String

}
