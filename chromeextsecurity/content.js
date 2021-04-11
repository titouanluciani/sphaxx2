//Delay function
const delay = (time) => {
    return new Promise(function(resolve){
        setTimeout(resolve, time)
    })
}

const connectBtn = '.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
const messageBtn = '.message-anywhere-button.pv-s-profile-actions.pv-s-profile-actions--message.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary'
const profileBtn = '.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.artdeco-button--disabled.ember-view'
const connectBtnPopup = '.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view'
const addNoteBtnPopup = '.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view'
const addNoteTextAreaPopup = '.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view'
//Get linkedin url of next profile action
//getNextUrl()

//Open linkedin tab profile url (already opened in popup.js)
//Do the action
console.log("content script : ", !!document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'))
chrome.storage.local.get("response", async (response) => {
    console.log("this si response : ",response)

    //IMPORTED FROM LAUNCHSCRIPT
    const data = response.response.nextAction.data
    console.log("this is dadta : ", data)
    const {prospectUrl, action, option, prospectName} = data
    let { description } = data
    console.log("this is fragmented data : ",prospectUrl, action, option, description, prospectName)
    const url = prospectUrl

    const { nextAction, user, prospectd} = response.response
    const prospectData = prospectd.data
    //Update in WG done to true
    let info = { "wgDone": true, "prospectdref":prospectd.ref['@ref'].id,"userref":user.ref['@ref'].id,"wgref":nextAction.ref['@ref'].id }
    console.log(user.ref['@ref'].id)
    await delay(Math.random() * 1.5 + 2000)
    console.log("jusqu ici tout va bien")
    //await page.waitForNavigation()

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
        //await page.waitForSelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
        const connectExist = !document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
        console.log("connect exist (true=does not, false=exist) ",connectExist)
        //If connect btn doesn't exist
        if(connectExist){
            console.log("connect btn doesn't exist")
            //Click on trois petits points
            try{
                console.log("trois petits points")
                await delay(1000)
                document.querySelector('.ml2.mr2.pv-s-profile-actions__overflow-toggle.artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view').click()
                console.log("trois petits points1")
                await delay(Math.random() + 500)
                let popup = document.querySelector('.pv-s-profile-actions__overflow-dropdown.display-flex.artdeco-dropdown__content.artdeco-dropdown--is-dropdown-element.artdeco-dropdown__content--justification-left.artdeco-dropdown__content--placement-bottom.ember-view')
                let popupPoints = popup.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.pv-s-profile-actions__overflow-button.full-width.text-align-left.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown.ember-view')
                console.log("trois petits points2")
                await delay(Math.random() + 500)
                //popupPoints.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.pv-s-profile-actions__overflow-button.full-width.text-align-left.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown.ember-view').click()
                let pending = false
                if(popupPoints.innerText.includes("En attente") || popupPoints.innerText.includes("Pending")){
                    console.log("trois petits points en attente")
                    pending = true
                }else if(popupPoints.innerText.includes("Se connecter") || popupPoints.innerText.includes("Connect")){
                    console.log("trois petits points Connect")
                    popupPoints.click()
                }
                console.log("trois petits points3")
                //Add { 'isConnected':true, 'hasAccepted':false } to info (to update the prospect)
                /*await userClient.query(
                    Update(
                        prospectd.ref,
                        { data: { 'isConnected':true, 'hasAccepted':false } }
                        )
                        )*/
                info = { ...info, 'isConnected':true, 'hasAccepted':false }
                console.log("trois petits points4 & info : ", info)
                if(document.querySelector(connectBtnPopup)){
                    console.log('if statement')
        
                    //If no note to send
                    if(description == '' || description == ' '){
                        console.log("no note")
        
                        /* CHECK IF CONNECTED ALREADY */
                        //Click on Connect btn in popup
                        if(!document.querySelector(connectBtnPopup) && !(popupPoints.innerText.includes("En attente") || popupPoints.innerText.includes("Pending"))){
                            console.log("put holdddd")
                            //Hold to true in info
                            /*
                            await client.query(
                                Update(
                                    Select(
                                        ['ref'],
                                        Get(
                                            Match(
                                                Index('users_by_url'),
                                                user_url
                                            )
                                        ))
                                    ,
                                    { data : { hold: true } }
                                )
                            )*/
                            info = { ...info, hold:true }
                        }
                        console.log("click on connect btn popup")
                        document.querySelector(connectBtnPopup).click()
        
                        //Update prospects with action info
                        /*await userClient.query(
                            Update(
                                prospectd.ref,
                                { data: { 'action':action, 'note':false, 'isConnected':true, 'hasAccepted':false } }
                            )
                        )*/
                        info = { ...info, 'action':action, 'note':false, 'isConnected':true, 'hasAccepted':false }
                    }
        
                    //If note to be send with connection
                    else{
                        console.log("note : ", description)        
                        
        
                        //Click the Add note button in popup
                        await delay(Math.random() + 3000)
                        try{
                            console.log("try add note btn popup :", !addNoteBtnPopup)
                            document.querySelector(addNoteBtnPopup).click()
                        }catch(err){
                            console.log("err when click add note : ", err)

                        }
                        //Focus the textArea
                        await delay(Math.random() + 4500)
                        
                        if(!!document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')){
                            let textarea = document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')
                            textarea.value = description
                            var evt = document.createEvent("Events");
                            evt.initEvent("change", true, true);
                            textarea.dispatchEvent(evt);
                        }else if(!!document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')){
                            console.log("error for focus text area")
                            let textarea = document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')
                            textarea.value = description
                            var evt = document.createEvent("Events");
                            evt.initEvent("change", true, true);
                            textarea.dispatchEvent(evt);
                        }else{
                            console.log("try add text area popup")
                            //await page.focus(addNoteTextAreaPopup)
                            let textarea = document.getElementsByTagName('textarea')[0]
                            await delay(Math.random() + 500)
                            document.querySelector(textarea).focus()
                            textarea.value = description
                            var evt = document.createEvent("Events");
                            evt.initEvent("change", true, true);
                            textarea.dispatchEvent(evt);
                        }
                        await delay(Math.random() + 5000)
                        //Type the description in textArea
                        console.log("type desc")
                        await delay(Math.random() + 7000)
        
                        //Click on connect after typing the description note
                        try{
                            console.log("click on send ")
                            document.querySelector('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view').click()
                        }catch(err){
                            console.log("click send err : ",err)

                        }
                        await delay(Math.random() + 3000)
                        //Update prospects with action info
                        /*await userClient.query(
                            Update(
                                prospectd.ref,
                                { data: { 'action':action, 'note':true, 'isConnected':true, 'hasAccepted':false, "hasResponded":false } }
                            )
                        )*/
                        info = { ...info, 'action':action, 'note':true, 'isConnected':true, 'hasAccepted':false, "hasResponded":false }
                    }
                }else if(!document.querySelector(connectBtnPopup) && !pending){
                        console.log("put hold2")
                        /*await client.query(
                            Update(
                                Select(
                                    ['ref'],
                                    Get(
                                        Match(
                                            Index('users_by_url'),
                                            user_url
                                        )
                                    ))
                                ,
                                { data : { hold: true } }
                            )
                        )*/
                        info = { ...info, hold:true }
                }
            }catch(err){
                console.log("err on trois petits points")
                //Update user Info
                /*await userClient.query(
                    Update(
                        prospectd.ref,
                        { data: { 'isConnected':true, 'hasAccepted':true } }
                    )
                )*/
                info = { ...info, 'isConnected':true, 'hasAccepted':true }
            }
        }else{
            console.log("connect btn exist")
            //Get the text on the connect btn profile
            await delay(Math.random() + 2500)
            console.log("connect btn exist")
            let profileBtnInnerText = ''/*
            try{

                profileBtnInnerText = await page.evaluate(() => {
                        console.log("profile btn inner text : ")
                        
                        const el = document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.artdeco-button--disabled.ember-view')//profileBtn
                        return el.innerText
                })
            }catch(err){
                console.log("profile btn inner text err : ", err)

                profileBtnInnerText = await page.evaluate(() => {
                    //document.querySelector('.ml2.mr2.pv-s-profile-actions__overflow-toggle.artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view').click()
                    if(!document.querySelector('.display-flex.t-normal.pv-s-profile-actions__label')){
                        console.log("pro btn inner text 2")
                        const el = document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
                        return el.innerText
                    }else{
                        console.log("pro btn inner text 3")
                        const el = document.querySelector('.display-flex.t-normal.pv-s-profile-actions__label')
                        return el.innerText
                    }
                })
            }*/
            let elements = Array.from(document.getElementsByTagName('span'), element => element.innerText)
            console.log(elements)
            console.log(typeof elements)
            console.log(typeof Array.from(elements))
            for(const el of elements){
                if(el == 'Se connecter'){
                    console.log("elllll : ",el)
                }
            }
            let doneFor = false
            for(const el of elements){
                //let el = elements.values[i]
                if((el == 'Se connecter' || el == 'Connect' || el == 'En attente' || el == 'Pending') && !doneFor){
                    doneFor = true
                    console.log("el.innerTExt : ",el)
                    profileBtnInnerText = el
                    //console.log("connect btn exist3 : ", profileBtnInnerText)

                    //Check if Connected already
                    if(profileBtnInnerText == 'En attente' || profileBtnInnerText == 'Pending'){
                        //Update Prospect info with "action='connect', isConnected = false, hasAccepted=false"
                        console.log("en attente")
                        /*await userClient.query(
                            Update(
                                prospectd.ref,
                                { data: { 'action':action ,'isConnected':true, 'hasAccepted':false } }
                            )
                        )*/
                        info = { ...info, 'action':action ,'isConnected':true, 'hasAccepted':false }
                        
                        //End the script
                        chrome.storage.local.set({ "info":info })
                        chrome.runtime.sendMessage({'message':'launchscript info set'})
                        window.close()
                        
                    //Check if prospect not connected
                    }else if(profileBtnInnerText == 'Se connecter' || profileBtnInnerText == 'Connect' ){// || prospectData.isConnected == false
                        //Click on "Se connecter"
                        console.log("se connecter")

                        const click_response = document.querySelector(connectBtn).click()
                        console.log(click_response)
                            
                        //Check if popup appears
                        if(document.querySelector(connectBtnPopup)){
                            console.log('if statement')
                
                            //If no note to send
                            if(description == '' || description == ' '){
                                console.log("no note")
                
                                /* CHECK IF CONNECTED ALREADY */
                                //Click on Connect btn in popup
                                if(!document.querySelector(connectBtnPopup)){
                                    console.log("put hold3")
                                    /*await client.query(
                                        Update(
                                            Select(
                                                ['ref'],
                                                Get(
                                                    Match(
                                                        Index('users_by_url'),
                                                        user_url
                                                    )
                                                ))
                                            ,
                                            { data : { hold: true } }
                                        )
                                    )*/
                                    info = { ...info, 'hold':true }
                                }
                                console.log("click on connect btn popup")
                                document.querySelector(connectBtnPopup).click()
                
                                //Update prospects with action info
                                /*await userClient.query(
                                    Update(
                                        prospectd.ref,
                                        { data: { 'action':action, 'note':false, 'isConnected':true, 'hasAccepted':false } }
                                    )
                                )*/
                                info = { ...info, 'action':action, 'note':false, 'isConnected':true, 'hasAccepted':false }
                            }
                
                            //If note to be send with connection
                            else{
                                console.log("note : ", description)        
                                
                
                                //Click the Add note button in popup
                                await delay(Math.random() + 2500)
                                try{
                                    console.log("try add note btn popup :", !addNoteBtnPopup)
                                    await document.querySelector(addNoteBtnPopup).click()
                                }catch(err){
                                    console.log("err when click add note : ", err)

                                }
                                //Focus the textArea
                                await delay(Math.random() + 2500)
                                if(!!document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')){
                                    let textarea = document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')
                                    textarea.value = description
                                    var evt = document.createEvent("Events");
                                    evt.initEvent("change", true, true);
                                    textarea.dispatchEvent(evt);
                                }else if(!!document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')){
                                    console.log("error for focus text area")
                                    let textarea = document.querySelector('.ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3')
                                    textarea.value = description
                                    var evt = document.createEvent("Events");
                                    evt.initEvent("change", true, true);
                                    textarea.dispatchEvent(evt);
                                }else{
                                    console.log("try add text area popup")
                                    //await page.focus(addNoteTextAreaPopup)
                                    let textarea = document.getElementsByTagName('textarea')[0]
                                    await delay(Math.random() + 500)
                                    document.querySelector(textarea).focus()
                                    textarea.value = description
                                    var evt = document.createEvent("Events");
                                    evt.initEvent("change", true, true);
                                    textarea.dispatchEvent(evt);
                                }
                                
                                await delay(Math.random() + 5000)
                                //Type the description in textArea
                                console.log("type desc")
                                await delay(Math.random() + 7000)
                
                                //Click on connect after typing the description note
                                try{
                                    console.log("click on send ")
                                    await document.querySelector('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view').click()
                                }catch(err){
                                    console.log("click send err : ",err)
                                }
                                await delay(Math.random() + 2500)
                                //Update prospects with action info
                                info = { ...info, 'action':action, 'note':true, 'isConnected':true, 'hasAccepted':false, "hasResponded":false }
                                /*await userClient.query(
                                    Update(
                                        prospectd.ref,
                                        { data: { 'action':action, 'note':true, 'isConnected':true, 'hasAccepted':false, "hasResponded":false } }
                                    )
                                )*/
                            }
                        }else if(!document.querySelector(connectBtnPopup)){
                                console.log("put hold4")
                                /*await client.query(
                                    Update(
                                        Select(
                                            ['ref'],
                                            Get(
                                                Match(
                                                    Index('users_by_url'),
                                                    user_url
                                                )
                                            ))
                                        ,
                                        { data : { hold: true } }
                                    )
                                )*/
                                info = { ...info, 'hold':true }
                        }
                    }
                }
            }
        }
        
        
        //res.statusCode = 200
        //res.json(url)
        //await browser.close()
        chrome.storage.local.set({ "info":info, "user":user, "prospectd":prospectd, "nextAction":nextAction })
        chrome.runtime.sendMessage({'message':'launchscript info set'})
        window.close()


    }else if(action == 'message'){
        /* CHECK IF HAS ACCEPTED CONNECTION && CHECK IF NOTE HAS BEEN SEND (if so CHECK IF HAS RESPONDED) */
        /* CHECK IF HAS ACCEPTED CONNECTION BEFORE DELETED */
        
        const connectExistPas = document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
        console.log(connectExistPas)
        //Check if connect btn exist
        if(connectExistPas == false){
            //Update user Info
            /*await userClient.query(
                Update(
                    prospectd.ref,
                    { data: { 'isConnected':false, 'hasAccepted':false } }
                )
            )*/
            info = { ...info, 'isConnected':false, 'hasAccepted':false }
        }
        //If connect btn exist pad
        else if(connectExistPas){
            console.log("already connected")
            //Click on message btn
            await delay(Math.random() + 1500)
            await document.querySelector(messageBtn).click()
            await delay(Math.random() + 1500)
            //Check if hasResponded
            let hasResponded = false
            const allMessages = document.querySelectorAll('.msg-s-event-listitem--group-a11y-heading.visually-hidden')
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
                await delay(Math.random() + 3000)
                await page.keyboard.type(description)
                await delay(Math.random() + 3000)
                //Click "Envoyer"
                await page.click('.msg-form__send-button.artdeco-button.artdeco-button--1')
                await delay(Math.random() + 3000)

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
        await browser.close()
        res.statusCode =200
        res.send("aha")
    }
            
})


//Close & update state somewhere (cookies ?)
