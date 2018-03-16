import {QuizAttendee} from "./quiz-attendee";
import {Event} from "./event";
import {User} from "./user";

export interface Quiz {

	_id: String,
    tableNumber: Number,
    event:  Event,
    bookedBy : User,
    paypalLink : String,
    tableType : String,
    attendees : QuizAttendee[]

}
