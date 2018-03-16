import {Event} from "./event";
import {User} from "./user";

export interface Jersey {

    _id: String,
    user : User,
    event : Event,
    size : String,
    hidden : Boolean,
    username : String,
    paid : Boolean

}
