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
    await page.goto(userUrl)
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
        //Get prospect Url and check action + note
        if(d.data.action == 'connect' || d.data.action == 'message'){
            //Go to relations menu
            await page.goto("https://www.linkedin.com/mynetwork/invite-connect/connections/")
            //Search for the prospect
            await page.click("#mn-connections-search-input")
            await page.keyboard.type(d.data.prospectName)
            const prospectExist = await page.evaluate(() => {
                const coBtn = document.querySelector('span.mn-connection-card__name.t-16.t-black.t-bold')
                console.log(coBtn)
                return coBtn
            })
            //If prospect doesn't exist
            if(!prospectExist){
                console.log(prospectExist)
                //Update it's state
                await userClient.query(
                    Update(
                        Select(['data',0, 'ref'],
                            Map(
                                Paginate(Intersection(
                                    Match(
                                        Index("prospects_by_url"), d.data.prospectUrl
                                    ),
                                    Match(
                                        Index("prospects_by_user"), d.data.userUrl
                                    )
                                )),
                                Lambda("x", Get(Var("x")))
                            )
                        ), 
                        { data: { 'hasAccepted':false } }
                    )
                )
            }else{
                console.log(prospectExist)
                //Update it's state
                await userClient.query(
                    Update(
                        Select(['data',0, 'ref'],
                            Map(
                                Paginate(Intersection(
                                    Match(
                                        Index("prospects_by_url"), d.data.prospectUrl
                                    ),
                                    Match(
                                        Index("prospects_by_user"), d.data.userUrl
                                    )
                                )),
                                Lambda("x", Get(Var("x")))
                            )
                        ),
                        { data: { 'hasAccepted':true } }
                    )
                )   
                //Check if prospect has responded
                await page.click('.message-anywhere-button.artdeco-button.artdeco-button--secondary')
                
                let hasResponded = false
                const allMessages = await page.evaluate(() => {
                    return document.querySelectorAll('.msg-s-event-listitem--group-a11y-heading.visually-hidden')
                })
                console.log(allMessages)
                for(let item of allMessages){
                    console.log(item, item.innerText)
                    console.log(item.innerText.split(' a envoyé le message suivant à')[0])
                    if(item.innerText.split(' a envoyé le message suivant à')[0] == prospectName){
                        hasResponded = true
                    }
                }
                if(hasResponded){
                    await userClient.query(
                        Update(
                            Select(['data',0, 'ref'],
                                Map(
                                    Paginate(Intersection(
                                        Match(
                                            Index("prospects_by_url"), d.data.prospectUrl
                                        ),
                                        Match(
                                            Index("prospects_by_user"), d.data.userUrl
                                        )
                                    )),
                                    Lambda("x", Get(Var("x")))
                                )
                            ),
                            { data: { 'hasResponded':true } }
                        )
                    )   
                }else{
                    await userClient.query(
                        Update(
                            Select(['data',0, 'ref'],
                                Map(
                                    Paginate(Intersection(
                                        Match(
                                            Index("prospects_by_url"), d.data.prospectUrl
                                        ),
                                        Match(
                                            Index("prospects_by_user"), d.data.userUrl
                                        )
                                    )),
                                    Lambda("x", Get(Var("x")))
                                )
                            ),
                            { data: { 'hasResponded':false } }
                        )
                    )
                }
            }

        }
    }


    res.statusCode = 200
}