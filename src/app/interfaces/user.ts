export interface User {

    regEvents: String[],
    _id: String,
    discord: {
        username: String,
        verified: boolean,
        mfa_enabled: boolean,
        id: String,
        avatar: String,
        discriminator: String,
        provider: String,
        accessToken: String,
        fetchedAt: String,
    },
    regDate: String,
    admin : boolean,
    realName : String,
    nickname : String

}
