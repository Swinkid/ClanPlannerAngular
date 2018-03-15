import {QuizAttendee} from "./quiz-attendee";

export interface Quiz {

	_id: String,
    tableNumber: Number,
    event:  String,
    bookedBy : String,
    paypalLink : String,
    tableType : String,
    attendees : QuizAttendee[]

}
