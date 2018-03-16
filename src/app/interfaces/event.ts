import {Attendance} from "./attendance";

export interface Event {

    _id: String,
    users: Attendance[],
    activities: String[],
    name: String,
    fromDate: String,
    toDate: String,
    attendance: Object[],
    seatPickerUrl : String,
    eventLocation : String

}
