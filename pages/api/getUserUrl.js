require('dotenv').config()
const puppeteer = require('puppeteer')
const formattedResponse = require('./utils/formattedResponse')
const delay = require('./utils/delay')
const axios = require('axios')
const auth = require('./auth')
const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const { Exists, Match, Index, Collection, Create, Update } = faunadb.query

//http://localhost:3000
//https://sphaxx.vercel.app

export default async(event, context) => {
        console.log("event wtf : ",event.body)

        const {url, cookies} = event.body
        console.log(cookies)
        process.env.USER_COOKIES = JSON.stringify(cookies)
        console.log("ENV USER COOKIES", process.env.USER_COOKIES)
        console.log("start auth")
        const browser = await puppeteer.launch({headless:true, executablePath:'node_modules/puppeteer/.local-chromium/win64-848005' })
        console.log("launchhhh")
        
        const page = await browser.newPage()
        console.log("pageeee")
        
        await delay(100)
        await page.goto("https://linkedin.com")
        console.log("linkedin")
        await page.setCookie(...cookies)
        //console.log("cookies")
        
        await delay(100)
        await page.goto("https://linkedin.com/feed/")
        
        // Get current user 's linkedin's url (PRIMARY KEY)
        await page.waitForSelector('.feed-identity-module__actor-meta.profile-rail-card__actor-meta.break-words')
        const a = await page.$('.feed-identity-module__actor-meta.profile-rail-card__actor-meta.break-words')
        const pr = await a.$('a')
        const b = await pr.getProperty('href')
        const c = await b.jsonValue()
        console.log(c)
        process.env.USER_URL = c
        console.log('ENV USER URL : ',c)
        
        const userExist = await client.query(
                Exists(
                        Match(
                                Index('users_by_url'), c
                        )
                )
        )
        if(userExist){
                const token = await auth(c)
                console.log('token : ',token)
        }else{
                await userClient.query(Create(Collection("users"), {
                        credentials: { password: c },
                        data: {
                          url: c
                        }
                      }))
                const token = await auth(c)
                console.log('token after user creation : ',token)
        }


        const userClient = new faunadb.Client({ secret: token.secret })

        
        const exist = await userClient.query(
                Exists(
                        Match(
                                Index('tokens_by_url'), c
                        )
                )
        )
        
        console.log("Is there any token already for that user ???",exist)
        if(!exist){
                await client.query(
                        Create(
                                Collection('tokens'),
                                { data: { userUrl: c, token: token } }
                        )
                )
        }else{
                await client.query(
                        Update(
                                Collection('tokens'),
                                { data: { token: token } }
                        )
                )      

        }

        context.statusCode = 200
        context.json(JSON.stringify(c))
    
}