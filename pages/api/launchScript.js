require('dotenv').config
const delay = require('./utils/delay')
const puppeteer = require('puppeteer')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete } = faunadb.query

export default async function(req, res){
    console.log(req.body)
    const {cookie, cookies} = JSON.parse(req.body)
    const user_url = cookie
    console.log("Launchscript : user_url & cookies : ",user_url, cookies)
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
    console.log("LAUNCHSCRIPT :: this is user secret : ",user_secret)
    const userClient = new faunadb.Client({ secret: user_secret })
    const url = await userClient.query(
        Select(['data',0, 'data', 'prospectUrl'],
            Map(
                Paginate(
                    Match(Index('waitingLine_by_user'), user_url)
                ),
                Lambda('x', Get(Var('x'))
                )
            )
        )
    )
    console.log("url to connect to : ",url)
    const browser = await puppeteer.launch({defaultViewport: null,headless:true})
    console.log("launchhhh")
    
    const page = await browser.newPage()
    console.log("pageeee")
    
    await delay(3000)
    await page.goto("https://linkedin.com")
    console.log("linkedin")

    await page.setCookie(...cookies)
    await page.goto(url)

    await delay(2500)
    console.log("jusqu ici tout va bien")
    //await page.waitForNavigation()
    console.log("jusqu ici tout va bien waitfor")
    try{
        const click_response = await page.click('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
        console.log(click_response)
        try{
            if(page.$('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view')){
                console.log('if statement')
                await page.click('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view')
            }
        }catch(err){
            console.log(err)
        }
        res.statusCode = 200
        res.json(url)

    }catch(err){
        console.log(err)
        res.statusCode = 500
        res.json(url)
    }
    // ADD A NOTE SELECTOR
    // page.click('.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view')
    
    await userClient.query(
        Delete(
            Select(['data',0, 'ref'],
                Map(
                    Paginate(
                        Match(Index('waitingLine_by_user'),'https://www.linkedin.com/in/titouan-luciani-160943160/')
                    ),
                    Lambda('x', Get(Var('x'))
                    )
                )
            )
        )
    )
    
}