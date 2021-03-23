require('dotenv').config
const delay = require('./utils/delay')
const puppeteer = require('puppeteer')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete, Update, Intersection } = faunadb.query
import chromium from 'chrome-aws-lambda';


export default async function(req, res){
    const connectBtn = '.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
    const messageBtn = '.message-anywhere-button.pv-s-profile-actions.pv-s-profile-actions--message.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary'
    const profileBtn = '.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.artdeco-button--disabled.ember-view'
    const connectBtnPopup = '.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view'
    const addNoteBtnPopup = '.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view'
    const addNoteTextAreaPopup = '.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view'


    console.log(req.body)
    const {cookie, cookies} = JSON.parse(req.body)
    const user_url = cookie.value
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
    const d = await userClient.query(
        Select(['data',0],
            Map(
                Paginate(
                    Intersection(
                        Match(Index('waitingLine_by_done'), false),
                        Match(Index('waitingLine_by_user'), user_url)
                    )
                ),
                Lambda('x', Get(Var('x'))
                )
            )
        )
    )
    const data = d.data
    
    console.log("this is dadta : ", data)
    const {prospectUrl, action, option, prospectName} = data
    let { description } = data
    console.log("this is fragmented data : ",prospectUrl, action, option, description, prospectName)
    const url = prospectUrl

    const prospectd = await userClient.query(
        Select(['data',0],
            Map(
                Paginate(
                    Match(Index('prospects_by_url'), prospectUrl)
                ),
                Lambda('x', Get(Var('x'))
                )
            )
        )
    )
    const prospectData = prospectd.data
    //Update in WG done to true
    await userClient.query(
        Update(
            d.ref,
            { data : { done:true } }
        )
    )
    /*
    await userClient.query(
        Update(
            Select(['data',0, 'ref'],
                Map(
                    Paginate(
                        Intersection(
                            Match(Index('waitingLine_by_done'), false),
                            Match(Index('waitingLine_by_prospectUrl'), prospectUrl),
                            Match(Index('waitingLine_by_user'),user_url)
                        )
                    ),
                    Lambda('x', Get(Var('x'))
                    )
                )
            ),
            { data : { done:true } }
        )
    )*/
    

    console.log("url to connect to : ",url)
    const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: false,
        ignoreHTTPSErrors: true,
        })
    console.log("launchhhh")
    
    const page = await browser.newPage()
    console.log("pageeee")
    
    await delay(3000)
    await page.goto("https://linkedin.com")
    console.log("linkedin")

    await page.setCookie(...[cookies])
    await page.goto(url)

    await delay(2500)
    console.log("jusqu ici tout va bien")
    //await page.waitForNavigation()
    console.log("jusqu ici tout va bien waitfor")

    //Replace with prospect name in description
    console.log("prospectName : ", prospectName.split(' ')[0],prospectName.split(' ')[1].trim())
    if(description.match('{{firstname}}')){
        console.log(description.replace('{{firstname}}', prospectName.split(' ')[0].trim()))
        description = description.replace('{{firstname}}', prospectName.split(' ')[0].trim())
    }
    if(description.match('{{name}}')){
        console.log(description.replace('{{firstname}}', prospectName.split(' ')[0].trim()))
        description = description.replace('{{name}}', prospectName.split(' ')[1].trim())
    }
    console.log(description)


    //Connect action or Message action
    if(action=='connect'){
        const connectExist = await page.evaluate(() => {
            const coBtn = document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
            console.log(!coBtn)
            return !coBtn
        })
        console.log(connectExist)
        //If connect btn doesn't exist
        if(connectExist){
            console.log("connect btn doesn't exist")
            //Update user Info
            await userClient.query(
                Update(
                    prospectd.ref,
                    { data: { 'isConnected':true, 'hasAccepted':true } }
                )
            )
        }else{
            console.log("connect btn exist")
            //Get the text on the connect btn profile
            await delay(3000)
            const profileBtnInnerText = await page.evaluate(() => {
                try{
                    
                    const el = document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.artdeco-button--disabled.ember-view')//profileBtn
                    return el.innerText
                }catch(err){
                    //document.querySelector('.ml2.mr2.pv-s-profile-actions__overflow-toggle.artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view').click()
                    const el = document.querySelector('.display-flex.t-normal.pv-s-profile-actions__label')
                    return el.innerText
                }
            })
            //Check if Connected already
            if(profileBtnInnerText == 'En attente'){
                //Update Prospect info with "action='connect', isConnected = false, hasAccepted=false"
                await userClient.query(
                    Update(
                        prospectd.ref,
                        { data: { 'action':action ,'isConnected':false, 'hasAccepted':false } }
                    )
                )

                //End the script
            //Check if prospect not connected
            }else if(profileBtnInnerText == 'Se connecter' || prospectData.isConnected == false ){
                //Click on "Se connecter"
                const click_response = await page.click(connectBtn)
                console.log(click_response)
                    
                //Check if popup appears
                if(page.$(connectBtnPopup)){
                    console.log('if statement')
        
                    //If no note to send
                    if(description == '' || description == ' '){
                        console.log("no note")
        
                        /* CHECK IF CONNECTED ALREADY */
                        //Click on Connect btn in popup
                        await page.click(connectBtnPopup)
        
                        //Update prospects with action info
                        await userClient.query(
                            Update(
                                prospectd.ref,
                                { data: { 'action':action, 'note':false, 'isConnected':false, 'hasAccepted':false } }
                            )
                        )
                    }
        
                    //If note to be send with connection
                    else{
                        console.log("note : ", description)        
                        
        
                        //Click the Add note button in popup
                        await delay(3000)
                        await page.click(addNoteBtnPopup)
                        //Focus the textArea
                        await delay(3000)
                        try{
                            await page.focus(addNoteTextAreaPopup)
                        }catch(err){
                            console.log("error for focus text area")
                            await page.focus('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')
                        }
                        await delay(3000)
                        //Type the description in textArea
                        await page.keyboard.type(description)
                        await delay(3000)
        
                        //Click on connect after typing the description note
                        await page.click('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view')
                        await delay(3000)

        
                        //Update the prospect with current action info
                        await userClient.query(
                            Update(
                                prospectd.ref,
                                { data: { 'action':action, 'note':true } }
                            )
                        )
                        //Update prospects with action info
                        await userClient.query(
                            Update(
                                prospectd.ref,
                                { data: { 'action':action, 'note':true, 'isConnected':false, 'hasAccepted':false, "hasResponded":false } }
                            )
                        )
                    }
                }
            }
        }
        
        
        res.statusCode = 200
        res.json(url)

    }else if(action == 'message'){
        /* CHECK IF HAS ACCEPTED CONNECTION && CHECK IF NOTE HAS BEEN SEND (if so CHECK IF HAS RESPONDED) */
        /* CHECK IF HAS ACCEPTED CONNECTION BEFORE DELETED */
        
        const connectExistPas = await page.evaluate(() => {
            const coBtn = document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
            console.log(!coBtn)
            return !coBtn
        })
        console.log(connectExistPas)
        //Check if connect btn exist
        if(connectExistPas == false){
            //Update user Info
            await userClient.query(
                Update(
                    prospectd.ref,
                    { data: { 'isConnected':false, 'hasAccepted':false } }
                )
            )
        }
        //If connect btn exist pad
        else if(connectExistPas){
            console.log("already connected")
            //Click on message btn
            await delay(1500)
            await page.click(messageBtn)
            await delay(1500)
            //Check if hasResponded
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
            if(hasResponded == false){
                console.log("has not responded")

                // Type message description
                await delay(3000)
                await page.keyboard.type(description)
                await delay(3000)
                //Click "Envoyer"
                await page.click('.msg-form__send-button.artdeco-button.artdeco-button--1')
                await delay(3000)

                const prospectUpdated = await userClient.query(
                    Update(
                        prospectd.ref,
                        { data: { 'action':action, 'isConnected':true, 'hasAccepted':true, 'hasResponded':false } }
                    )
                )
                console.log(prospectUpdated)
            }
            else if(hasResponded == true){
                console.log("has responded")

                await userClient.query(
                    Update(
                        prospectd.ref,
                        { data: { 'hasResponded':true } }
                    )
                )
            }

        }
    }
    
    
}