import {User} from "./user";
import {Event} from "./event";

export interface Competition {

    _id: String,
    user : User,
    event : Event,
    game   : String,
    teamName:  String,
    mainTeam: User[]
    subs: User[]

}
