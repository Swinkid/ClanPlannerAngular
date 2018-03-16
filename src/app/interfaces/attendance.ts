import {User} from "./user";
import {Event} from "./event";

export interface Attendance {

    _id: String,
    user : User,
    event : Event,
    realName: String,
    broughtTicket: Boolean,
    onSeatPicker: Boolean,
    dateArriving: Date,
    accommodation: String,
    transportPlans: String,
    location: String,
    inFacebookChat: Boolean

}
