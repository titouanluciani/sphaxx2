require('dotenv').config()

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, 
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

//const user_url = 'https://www.linkedin.com/in/titouan-luciani-160943160/'
export default async (req, res) => {
    console.log(JSON.parse(req.body))
    console.log(JSON.parse(req.body).user_url)
    console.log("reqq 2 : ", JSON.parse(req.body).user_url)
    const user_url = JSON.parse(req.body).user_url
    console.log(user_url)
    
    const login = await client.query(
        q.Login(
            q.Match(q.Index('users_by_url'), user_url),
            {password:user_url}
        )
    )
    console.log(login)
    process.env.USER_SECRET = login.secret
    console.log("ENV USER SECRET",process.env.USER_SECRET)
    const usersIndex = await client.query(
        Paginate(
            Match(Index('users_by_url'),user_url)
        )
    )
    console.log(usersIndex)

    /*const doc = await client.query(
        Get(
            Ref(
                Collection('prospects'), '287610356376797701'
            )
        )
    )
    console.log(doc)*/
    
    const userClient = new faunadb.Client({ secret: login.secret })
    //const ci = await userClient.query(Get(CurrentIdentity()))
    //console.log('current identity : ', ci)
    const login_url = await userClient.query(Select(['data','url'],Get(CurrentIdentity())))
    const prospects = await userClient.query(Map(
        Paginate(Match(
            Index('prospects_by_user'), Select(['data','url'],Get(CurrentIdentity())))
            ), Lambda(['ref'], Select( ['data'], Get(Var('ref'))))
    ))
    //console.log(login)
    console.log(login_url)
    console.log(prospects)
    //const logout = await userClient.query(Logout(true))
    //console.log(logout)
    res.statusCode = 200
    res.json(prospects)
}