require('dotenv').config
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Collection, Create, If, ContainsField } = faunadb.query

export default async (req, res) => {
    console.log("import csv req body : ",req.body)
    const { data, cookie:user_url, campaign } = JSON.parse(req.body)
    console.log("import csv info : ",data.data, typeof data.data)
    const user_secret = await client.query(
        Select(
            ['data', 'token', 'secret'],
            Get(
                Match(
                    Index('tokens_by_url'),
                    user_url
                )
            )
        )
    )
    const userClient = new faunadb.Client({ secret: user_secret })
    await userClient.query(
        Map(
            data.data,
            Lambda(
                'prospect',
                Create(
                    Collection("prospects"),
                    {
                        data:{
                            name:If(ContainsField('name', 'prospect'),Select(['name'],Var('prospect')), ''),
                            url:Select(['url'],Var('prospect')),
                            userUrl:user_url,
                            campaign:campaign,
                            isConnected:false
                        }
                    }
                )
            )
        )
    )

    res.statusCode = 200
    res.send("All is ok")
}