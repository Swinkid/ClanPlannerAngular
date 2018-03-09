export interface Attendance {

    _id: String,
    userId : String,
    eventId : String,
    discord : {
        username: String,
        verified: boolean,
        mfa_enabled: boolean,
        id: String,
        avatar: String,
        discriminator: String,
        email: String,
        provider: String,
        accessToken: String,
        fetchedAt: String,
    },
    realName: String,
    broughtTicket: Boolean,
    onSeatPicker: Boolean,
    dateArriving: Date,
    accommodation: String,
    transportPlans: String,
    location: String,
    inFacebookChat: Boolean

}
