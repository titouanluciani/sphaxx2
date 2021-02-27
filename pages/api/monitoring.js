require('dotenv').config()
const puppeteer = require('puppeteer')
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret:process.env.FAUNA_SECRET_KEY })
const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Intersection } = faunadb.query

export default async function(req,res){
    console.log(req.body)
    const { cookies, userUrl } = JSON.parse(req.body)
    console.log( cookies, userUrl )

    //Get secret
    const user_secret = await client.query(
        Select(
            ['data', 'token', 'secret'],
            Get(
                Match(
                    Index('tokens_by_url'),
                    userUrl
                )
            )
        )
    )
    //Initiate user client
    const userClient = new faunadb.Client({ secret: user_secret })
    const browser = await puppeteer.launch({defaultViewport: null,headless:false})
    const page = await browser.newPage()
    await delay(3000)
    //Connect to linkedin session
    await page.goto("https://linkedin.com")
    console.log("linkedin")

    await page.setCookie(...cookies)
    await page.goto(url)
    await delay(2500)
    console.log("connected to linkedin session")

    //Get past actions & Check state on linkedin session
    const data = await userClient.query(
        Select(['data'],
            Map(
                Paginate(
                    Intersection(
                        Match(Index('waitingLine_by_done'), true),
                        Match(Index('waitingLine_by_user'), user_url)
                    )
                ),
                Lambda('x', Get(Var('x'))
                )
            )
        )
    )
    for(let d of data){
        console.log(d)
    }


    res.statusCode = 200
}