require('dotenv').config()

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, 
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query


module.exports = async (user_url) => {
    return await client.query(
        q.Login(
            q.Match(q.Index('users_by_url'), user_url),
            {password:user_url}
        )
    )
}