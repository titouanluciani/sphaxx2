//<br><button id="startConnect">Start Connect Launch Script</button>

/* FUNCTION USED TO LAUNCH SCRAPE PROFILE */

//https://sphaxx-five.vercel.app
//https://sphaxx-five.vercel.app
chrome.storage.local.set({ 'scraping': 'none' })
chrome.runtime.sendMessage({ 'message': 'scraping state changed' })

async function getCookies({url,number=100, function_name="scrapeProfiles", campaign}){
    console.log("function name ",function_name, number, campaign)
    const response = chrome.cookies.get({"url":"https://www.linkedin.com/","name":"li_at"}, async cookies=> {
        console.log("tthiiis is cookies li at : ",cookies)
        chrome.cookies.get({"url":"https://sphaxx-five.vercel.app/","name":"userUrl"}, async cookie => {
            chrome.storage.local.set({ 'scraping': 'current' })
            console.log("tthiiis is cookie userUrl: ",cookie)

            cookie = cookie
            chrome.runtime.sendMessage({ 'message': 'scraping state changed' })
            const range = Math.ceil(number / 50) * 5
            let i = 1
            console.log("while loop")
            console.log("going for scrape profiles : ", url, cookie, cookies, number, campaign, range, i)
            do {
                console.log("for loop to fetch scrape profiles : ", i)
                console.log("going for scrape profiles : ", url, cookie, cookies, number, campaign, range, i)
                fetch(`https://sphaxxscraping.vercel.app/api/${function_name}`, {
                    method:"POST",
                    body: JSON.stringify({url, cookie, cookies, number, campaign, i}),
                }).then(async (scrapeResponse) => {
                    console.log("this is scrapeResponse : ", scrapeResponse) 
                    console.log("this is scrapeResponse json await : ", await scrapeResponse.json())
                    //chrome.storage.local.set({ 'scraping': 'done' })
                    //chrome.runtime.sendMessage({ 'message': 'scraping state changed' })
                    //chrome.runtime.sendMessage({ 'message': 'Import proceed' })
                }).catch(() => {
                    //chrome.storage.local.set({ 'scraping': 'done' })
                    //chrome.runtime.sendMessage({ 'message': 'scraping state changed' })

                })
                i+=3
                console.log("scraping done ??", i)
                await delay(70*1000)
                /*console.log("for loop 2 to fetch scrape profiles : ", i)
                fetch(`http://localhost:3000/api/${function_name}`, {
                    method:"POST",
                    body: JSON.stringify({url, cookie, cookies, number, campaign, i}),
                }).then(async (scrapeResponse) => {
                    console.log("this is scrapeResponse : ", scrapeResponse) 
                    console.log("this is scrapeResponse json await : ", await scrapeResponse.json())
                    chrome.storage.local.set({ 'scraping': 'done' })
                    chrome.runtime.sendMessage({ 'message': 'scraping state changed' })
                    chrome.runtime.sendMessage({ 'message': 'Import proceed' })
                }).catch(() => {
                    chrome.storage.local.set({ 'scraping': 'done' })
                    chrome.runtime.sendMessage({ 'message': 'scraping state changed' })

                })
                i+=1
                console.log("scraping done  2??")*/
            }while(i <= range+1);
            chrome.storage.local.set({ 'scraping': 'done' })
            chrome.runtime.sendMessage({ 'message': 'scraping state changed' })
            chrome.runtime.sendMessage({ 'message': 'Import proceed' })
            /*if(i < range){
                console.log("for loop to fetch scrape profiles : ", i)
                fetch(`http://localhost:3000/api/${function_name}`, {
                    method:"POST",
                    body: JSON.stringify({url, cookie, cookies, number, campaign, i}),
                    //headers:{
                    //    'Content-Type':'application/json'
                    //}
                }).then(async (scrapeResponse) => {
                    console.log("this is scrapeResponse : ", scrapeResponse) 
                    console.log("this is scrapeResponse json await : ", await scrapeResponse.json())
                    chrome.storage.local.set({ 'scraping': 'done' })
                    chrome.runtime.sendMessage({ 'message': 'scraping state changed' })
                    chrome.runtime.sendMessage({ 'message': 'Import proceed' })
                }).catch(() => {
                    chrome.storage.local.set({ 'scraping': 'done' })
                    chrome.runtime.sendMessage({ 'message': 'scraping state changed' })

                })
                i+=1
            }*/
            console.log("interval after first scraping ")
            
        })

    })
    console.log("this is response : ", response) 
    return response
}

/* TRIGGERED WHEN IMPORT BTN IS CLICKED */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message)
    
    if(request.message === 'res'){
        chrome.storage.local.get("response",async value => {
            console.log("res response to scrape profiles",value.response[0].url)
            if(/^https:\/\/www\.linkedin\.com\/search\/results\/people/.test(value.response[0].url)){
                chrome.storage.local.get(['number','campaign'],async (all) => {
                    const {number, campaign} = all
                    console.log(number, campaign)
                    const data = await getCookies({url:value.response[0].url, number:number, campaign:campaign})
                    
                    console.log(data)
                })
            }
        }) 
    }
})

/* LISTEN FOR REFRESH BTN IN EXTENSION POPUP TO RE LAUNCH THE GET USER URL API */
console.log("USERRR AGENT  : ", navigator.userAgent)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message=='set launch to true'){
        console.log("refresh btn trigger")
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                console.log("tabs : ", tabs)
                //tabs.forEach(async tab => {
                //    if(/^https:\/\/www\.linkedin\.com/.test(tab.url)){
                        //console.log(tab.url)
                        //launch = true
                        launch2 = false
                        console.log('refresh & linkedin tab open : ', launch)
                        console.log("launch local auth when tab is clicked")
                        launch = false
                        chrome.tabs.create( {url:"https://www.linkedin.com" ,active:false, index:0}, tab => {
                            chrome.tabs.update(tab.id, { pinned : true} )
                            chrome.tabs.executeScript(tab.id,{  file: './localAuth.js'})
                            chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
                                if(request.message === 'got the user url'){
                                    launch = false
                                    console.log("launch after localauth : ", launch)
                                    chrome.tabs.remove(tab.id)
                                    /*chrome.runtime.storage.get("userUrl", userUrl => {
                                        await fetch('https://sphaxx-five.vercel.app/getUserUrl')
                                    })*/
                                }
                            })
                        })

                    //}
                //})
            })
        
    }
})
/* LINKEDIN AUTH BTN */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message=='linkedinAuth'){
        console.log("auth btn trigger")
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                console.log("tabs : ", tabs)
                tabs.forEach(async tab => {
                    if(/^https:\/\/www\.linkedin\.com/.test(tab.url)){
                        console.log(tab.url)
                        console.log("linkedin auth")
                        const res = await fetch('https://sphaxx-five.vercel.app/api/linkedinAuth', {
                            method:"post",
                            body: JSON.stringify({cookies}),
                            headers:{
                                'Content-Type':'application/json'
                            }
                        })
                        console.log("linkedin auth res : ", res)
                        console.log("linkedin auth res : ", await res.json())

                    }
                })
            })
        
    }
})
/* COOKIES SET IN LINKEDIN TAB */

let launch = true
let launch2 = false
//Auth when tab is clicked
/*chrome.tabs.onActivated.addListener(() => {
    chrome.windows.getCurrent( {'populate':true} , (currentWindow) =>{
        chrome.tabs.query({windowId: currentWindow.id }, (tabs) => {
            tabs.forEach(async tab => {
                console.log("tab clicked")
                if(/^https:\/\/sphaxx-five\.vercel\.app/.test(tab.url) && launch == true){
                    console.log("launch local auth when tab is clicked")
                    launch = false
                    chrome.tabs.create( {url:"https://www.linkedin.com" ,active:false, index:0}, tab => {
                        chrome.tabs.update(tab.id, { pinned : true} )
                        chrome.tabs.executeScript(tab.id,{  file: './localAuth.js'})
                        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
                            if(request.message === 'got the user url'){
                                launch = false
                                console.log("launch after localauth : ", launch)
                                chrome.tabs.remove(tab.id)
                                //chrome.runtime.storage.get("userUrl", userUrl => {
                                //    await fetch('https://sphaxx-five.vercel.app/getUserUrl')
                                //})
                            }
                        })
                    })
                }
            })
        })
    })
})*/


/*chrome.webNavigation.onCommitted.addListener(() => {//chrome.tabs.onActivated.addListener
    chrome.windows.getCurrent( {'populate':true} , (currentWindow) =>{//chrome.windows.getAll
        console.log(currentWindow)
        //windows.forEach(window => {
            chrome.tabs.query({windowId: currentWindow.id }, (tabs) => {
                //console.log(tabs)
                tabs.forEach(async tab => {
                    console.log('this is launch wtf : ', launch)
                    if(/^https:\/\/www\.linkedin\.com/.test(tab.url) && launch){
                        launch = false
                        //Test local auth
                        chrome.tabs.onUpdated.addListener(async (tabId, tabInfo) => {
                            if(tabId == tab.id && tabInfo.status === 'complete'){
                                await delay(1000)
                                console.log("launch local auth")
                                launch = false
                                chrome.tabs.create( {url:"https://www.linkedin.com" ,active:false, index:0}, tab => {
                                    chrome.tabs.update(tab.id, { pinned : true} )
                                    chrome.tabs.executeScript(tab.id,{  file: './localAuth.js'})
                                    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
                                        if(request.message === 'got the user url'){
                                            launch = false
                                            console.log("launch after localauth 2 : ", launch)
                                            chrome.tabs.remove(tab.id)
                                            //chrome.runtime.storage.get("userUrl", userUrl => {
                                            //    await fetch('https://sphaxx-five.vercel.app/getUserUrl')
                                            //})
                                        }
                                    })
                                })
                            }
            
                        })

                        launch = false
                        //launch2 = true
                        console.log('this is launch IN wtf : ', launch, launch2)
                        
                        console.log(tab)
                        const url = tab.url
                        console.log(url)
                        chrome.cookies.remove({"name":"cookiesSession", "url":"https://www.linkedin.com/"})
                        await chrome.cookies.get({"url":"https://www.linkedin.com/","name":"li_at"}, async cookies => {
                            console.log("cookies ",cookies)
                            chrome.cookies.set({"name":"cookiesSession", "value":JSON.stringify(cookies), "url":"https://www.linkedin.com/"}, (cookie) => {
                                console.log("Cookie set : ", cookie)
                                console.log("Cookie set : ", JSON.stringify(cookie.value))
                            })
                            
                            //const res = await fetch(`https://sphaxx-five.vercel.app/api/getUserUrl`, {
                                //mode:'no-cors',
                            //    method:"POST",
                            //    body: JSON.stringify({cookies}),
                                //headers:{
                                //    'Content-Type':'application/json',
                                //    'Access-Control-Allow-Origin':'https://sphaxx-five.vercel.app'
                                //}
                            //})
                            
                            // console.log("res",res)
                            // console.log("res",res.body)
                            // const data = await res.json()
                            // console.log("data",data)
                            // chrome.cookies.remove({"name":"userUrl", "url":"https://www.linkedin.com/"})
                    
                            // chrome.cookies.set({"name":"userUrl", "value":`${data}`, "url":"https://www.linkedin.com/"}, (cookie) => {
                            //     console.log("Cookie set : ", JSON.stringify(cookie))
                            //     launch2=true
                            //     console.log("launches : ", launch, launch2)
                            // })
                
                        })
                    }
                })
            })
        //})
    })
})*/

/* COOKIES SET IN APPLICATION TAB */


///^https:\/\/sphaxx-five\.vercel\.app
///^https:\/\/sphaxx-five\.vercel\.app
chrome.webNavigation.onCompleted.addListener(() => {//chrome.tabs.onActivated.addListener((tab_info) => {
    console.log("tab INFO for app.sphaxx " )//tab_info
    chrome.windows.getCurrent( {'populate':true} , (currentWindow) => {
        chrome.tabs.query({windowId: currentWindow.id }, (tabs) => {
            tabs.forEach(async tab => {
                console.log("going for the if to userurl in app")
    //chrome.tabs.get(tab_info.tabId, (tab) => {
        //console.log("tab for app.sphaxx ", tab)
        //console.log("tab for app.sphaxx ", launch2)
        if(/^https:\/\/sphaxx-five\.vercel\.app/.test(tab.url) && launch2){
            console.log("launch2")
            launch2 = false
            try{
                /*chrome.cookies.remove({"name":"userUrl", "url":tab.url})
                chrome.cookies.get({"url":"https://www.linkedin.com/","name":"userUrl"}, (cookie) => {
                    console.log("got cookie userUrl from linkedin : ",cookie)
                    chrome.cookies.set({"url":tab.url, "name":"userUrl","value":cookie.value}, (cookie) => {
                        console.log("cookie set in app : ", cookie)
                    })
                })
                chrome.cookies.remove({"name":"cookiesSession", "url":tab.url})
                chrome.cookies.get({"url":"https://www.linkedin.com/","name":"cookiesSession"}, (cookie) => {
                    console.log("got cookies cookiesSession from linkedin : ",cookie)
                    console.log("got cookies cookiesSession from linkedin : ",JSON.parse(cookie.value))
                    chrome.cookies.set({"url":tab.url, "name":"cookiesSession","value":cookie.value}, (cookie) => {
                        console.log("cookieSession set in app : ", cookie)
                    })
                })*/
            }catch(err){
                console.error(err)
            }
        }
    })})
    })
})


/* FUNCTION TO START THE NEXT ACTION IN WAITING LINE */

const startConnect = async () => {
    chrome.windows.getCurrent( {'populate':true} , (currentWindow) => {
        chrome.tabs.query({windowId: currentWindow.id }, (tabs) => {
                tabs.forEach(async tab => {
                    if(/^https:\/\/www\.linkedin\.com/.test(tab.url)){
                        await chrome.cookies.get({"url":"https://www.linkedin.com/","name":"li_at"}, async cookies=> {
                            console.log("Ready to launch")
                            chrome.cookies.get({"url":"https://www.linkedin.com/","name":"userUrl"}, async (cookie) => {
                            let userAgent = navigator.userAgent
                            const response = await fetch('https://sphaxx-five.vercel.app/api/launchScript', {
                            method: 'POST',
                            body: JSON.stringify({cookie,cookies, userAgent})
                        })
                        console.log("Start connect launchScript response : ", response)
                    })
                    //console.log("Start connect launchScript response json : ", response.json())
                })
            }
        })
    })
})
}
//setInterval(startConnect(), 1*20*1000)

/* HANDLE START CONNECT ie: LAUNCH IT EVERY 3 TO 5 MIN */

let i = 0;
let random = Math.random() * 3 + 5
let randomActions = Math.random() * 20 + 60
let date = new Date();
setInterval(() => {
    random = Math.random() * 3 + 5
    let currentDate = new Date()
    console.log("counting i : ",i, randomActions)
    if(i<randomActions && currentDate.getHours() > 6 && currentDate.getHours() < 23 && currentDate.getDay() < 6 && currentDate.getDay() > 0 ){
        i+=1;
        startConnect2()
    }
    if(date.getDay() !== currentDate.getDay() ){
        i = 0
        date = new Date();
        currentDate = new Date()
    }

}, random*60*1000)

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if(request.message=='start connect'){
        console.log("start connect triggered")
        await startConnect()
    }
})

//Monitoring
  let i2 = 0;
  let random2 = Math.random() * 2 + 3
  let date2 = new Date();
  setInterval(async () => {
      i2+=1;
      random2 = Math.random() * 2 + 3
      let currentDate2 = new Date()
      console.log("counting i : ",i2)
      if(i2<101 && currentDate2.getHours() > 8 && currentDate2.getHours() < 18 && currentDate2.getDay() < 6 ){
        await chrome.cookies.get({"url":"https://www.linkedin.com/","name":"li_at"}, async cookies => {
            await chrome.cookies.get({"url":"https://sphaxx-five.vercel.app/","name":"userUrl"}, async (cookie) => {
                    await fetch('https://sphaxx-five.vercel.app/api/monitoring', {
                        method:'POST',
                        body:JSON.stringify({ cookies:cookiesSession, cookie })
                    })
            })
        })
      }
      if(date2.getDay() !== currentDate2.getDay() ){
          i2 = 0
          date2 = new Date();
          currentDate2 = new Date()
      }
  
  }, random2*60*1000*20)

//Delay function
const delay = (time) => {
    return new Promise(function(resolve){
        setTimeout(resolve, time)
    })
}

//Launch script locally
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if(request.message=='launch script locally'){
        console.log('launch script locally')
        chrome.windows.getCurrent( {'populate':true} , (currentWindow) => {
                chrome.tabs.query({windowId: currentWindow.id }, (tabs) => {
                    tabs.forEach(async tab => {
                        if(/^https:\/\/sphaxx-five\.vercel\.app/.test(tab.url)){
                            await chrome.cookies.get({ "url":"https://sphaxx-five.vercel.app/", "name":"userUrl" }, async (cookie) => {
                                cookie = cookie.value
                                const res = await fetch('https://sphaxx-five.vercel.app/api/getNextUrl', {
                                    method:'POST',
                                    body: JSON.stringify({cookie})
                                })
                                console.log("response from getNextUrl : ", res)
                                const response = await res.json()
                                console.log("response from getNextUrl json : ", response)
                                if(response.user.data.hold){
                                    console.log("user on hold")
                                }else{
                                    chrome.tabs.create({ url: response.nextAction.data.prospectUrl,  active:false, index:0, windowId:window.id }, tab => {
                                        chrome.tabs.update(tab.id, { pinned : true} )
                                        console.log("linkedin tab created")
                                        chrome.storage.local.set({ "response":response })
                                        chrome.tabs.onUpdated.addListener(async (tabId, tabInfo) => {
                                            if(tabId == tab.id && tabInfo.status === 'complete'){
                                                await delay(500)
                                                chrome.tabs.executeScript(tab.id,{  file: './content.js'})
                                            }
                                        })
                                    })  
                                }
                            })
                        }
                    })
                })
        })
    }
})

//Retrieve info from launch script locally
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message)
    if(request.message === 'launchscript info set'){
        chrome.storage.local.get("info",async info => {
            chrome.storage.local.get("user",async user => {
                chrome.storage.local.get("prospectd",async prospectd => {
                    chrome.storage.local.get("nextAction",async nextAction => {

                        console.log("INFO FROM LAUNCH SCRIPT LOCALLY : ", info)
                        await fetch('https://sphaxx-five.vercel.app/api/updateInfo', {
                            method: 'POST',
                            body: JSON.stringify({ info, user, prospectd, nextAction })
                        })
                    })
                })
            })
        })
    }
})

const startConnect2 = async () => {
    console.log('launch script locally startconnect')
    chrome.windows.getCurrent( {'populate':true} , (currentWindow) => {
            chrome.tabs.query({windowId: currentWindow.id }, (tabs) => {
                tabs.forEach(async tab => {
                    if(/^https:\/\/sphaxx-five\.vercel\.app/.test(tab.url)){
                        
                        await chrome.cookies.get({ "url":"https://sphaxx-five.vercel.app/", "name":"userUrl" }, async (cookie) => {
                            cookie = cookie.value
                            const res = await fetch('https://sphaxx-five.vercel.app/api/getNextUrl', {
                                method:'POST',
                                body: JSON.stringify({cookie})
                            })
                            console.log("response from getNextUrl : ", res)
                            const response = await res.json()
                            console.log("response from getNextUrl json : ", response)
                            if(response.user.data.hold){
                                console.log("user on hold")
                            }else{
                                chrome.tabs.create({ url: response.nextAction.data.prospectUrl, active:false, index:0, windowId:window.id }, tab => {
                                    console.log("linkedin tab created")
                                    chrome.tabs.update(tab.id, { pinned : true} )
                                    chrome.storage.local.set({ "response":response })
                                    chrome.tabs.onUpdated.addListener(async (tabId, tabInfo) => {
                                        if(tabId == tab.id && tabInfo.status === 'complete'){
                                            await delay(500)
                                            chrome.tabs.executeScript(tab.id,{  file: './content.js'})
                                        }
                        
                                    })
                                })  
                            }
                        })
                    }
                })
            })
    })
}

//Get user url from local
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message == 'got the user url'){
        console.log(request.message)
        chrome.storage.local.get(["userUrl","imgUrl", "name"], async all => {
            const { userUrl, imgUrl, name } = all
            //const { userUrl, cookiesSession } = all
            console.log("going to be set user url local : ", userUrl)
            chrome.cookies.remove({"name":"userUrl", "url":"https://sphaxx-five.vercel.app/"})
            chrome.cookies.remove({"name":"cookiesSession", "url":"https://sphaxx-five.vercel.app/"})
            chrome.cookies.get({"url":"https://www.linkedin.com/","name":"li_at"}, async cookies=> {
                console.log(cookies.value)
                chrome.cookies.set({"name":"cookiesSession", "value":cookies.value, "url":"https://sphaxx-five.vercel.app/"})
            })
            chrome.cookies.set({"name":"userUrl", "value":userUrl, "url":"https://sphaxx-five.vercel.app/"}, () => {
                console.log("should be set local user url")
                /*chrome.cookies.set({"name":"cookiesSession", "value":JSON.stringify(cookiesSession), "url":"https://sphaxx-five.vercel.app/"})*/
            })
            await fetch('https://sphaxx-five.vercel.app/api/userCreation', {
                method:'POST',
                body:JSON.stringify({userUrl, imgUrl, name })
            })
        })
    }
})

/*chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === "launch personal stats"){
        chrome.cookies.get({ "url":"https://sphaxx-five.vercel.app/", "name":"userUrl" }, async (cookie) => {
            cookie = cookie.value
            chrome.tabs.create({ url: cookie,  active:false, index:0 }, tab => {
                chrome.tabs.update(tab.id, { pinned : true} )
                console.log("personal stats going to be executed")
                chrome.tabs.executeScript(tab.id,{  file: './personalStats.js'})
            })    
        })
    }
})*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === "got the numbers"){
        chrome.storage.local.get(["relationsNumber", "viewedProfile", "postViewedNumber"], all => {
            const { relationsNumber, viewedProfile, postViewedNumber } = all
            console.log(JSON.stringify(relationsNumber), viewedProfile, postViewedNumber)
            chrome.cookies.set({ "name": "relationsNumber" , "value": JSON.stringify(relationsNumber) , "url": "https://sphaxx-five.vercel.app/" }, (relation) => console.log("set relation number : ", relation))
            chrome.cookies.set({ "name": "viewedProfile" , "value": JSON.stringify(viewedProfile) , "url": "https://sphaxx-five.vercel.app/" })
            chrome.cookies.set({ "name": "postViewedNumber" , "value": JSON.stringify(postViewedNumber) , "url": "https://sphaxx-five.vercel.app/" })
        })
    } 
})

//Create user account when extension is installed
/*chrome.runtime.onInstalled.addListener(async () => {
    await fetch('https://sphaxx-five.vercel.app/userCreation', {

    })
})*/

chrome.runtime.onMessage.addListener((request, sender,sendResponse) => {
    if(request.message === "extension clicked"){
        chrome.tabs.query( { active:true, currentWindow: true }, tabs => {
            const currentTab = tabs[0]
            console.log("currenta tab is : ", currentTab)
            chrome.storage.local.set({ 'currentTab': currentTab })
            chrome.runtime.sendMessage({ message: 'current tab set in local' })
        } )
    }
    if(request.message === "linkedin search tab btn clicked"){
        chrome.tabs.create({ url:"https://www.linkedin.com/search/results/people/", active:true })
    }
})

