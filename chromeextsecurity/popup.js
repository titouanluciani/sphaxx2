//const {postRequest, getCookies} = require('./utils/functions')

//let valid_url = false
//<br><button id="linkedinAuth">Auth</button>


//"https://www.linkedin.com/search/results/people/*"
//activeTab
/*"content_scripts":[
        {
            "matches":["<all_urls>"],
            "js":["content.js"]
        }
    ], */

/*document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("btn").addEventListener('click',() => {
        valid_url = chrome.storage.local.get("valid_url")
        chrome.runtime.sendMessage(`is the url valid ? ${valid_url}`)
        if(valid_url){
            await postRequest()
        }
    })
})*/

//chrome.browserAction.onClicked.addListener(res => console.log(res))
const btn = document.getElementById('import')
const create_btn = document.getElementById('create')
const input = document.querySelector('input')
const refresh_btn = document.getElementById('refresh')
const linkedin_auth_btn = document.getElementById('linkedinAuth')
const start_connect = document.getElementById('startConnect')
//let response = ''

//Check the scraping state "done", "none", "current"
const scrapeState = () => {
    chrome.storage.local.get('scraping', (scraping) => {
        console.log("this is scraping : ",scraping.scraping)
        if(scraping.scraping === 'none' || scraping.scraping === 'done'){
            document.getElementById('loader').hidden = true
            document.getElementById('container').hidden = false

        }else if(scraping.scraping === 'current'){
            document.getElementById('loader').hidden = false
            document.getElementById('container').hidden = true
        }
    })
}

//Add campaigns to select element
const addOptions = async () => {
    //chrome.cookies.get({"name":"userUrl", "url":"https://sphaxx-five.vercel.app/"}, (user_url) => {
        //chrome.storage.local.set({ "userUrl": user_url })
    chrome.storage.local.get('userUrl', user_url => {
        console.log("user url : ", user_url.userUrl.value)
        fetch('https://sphaxx-five.vercel.app/api/getCampaigns', {
            method:"POST",
            body:JSON.stringify(user_url.userUrl.value)
        }).then(data => data.json())
            .then( data => {
                console.log('data : ', data.data)
                const campaigns = data.data
                console.log(campaigns)

                while (document.getElementById('campaigns').lastChild) {
                    console.log(typeof document.getElementById('campaigns').lastChild)
                    if(document.getElementById('campaigns').lastChild != document.getElementById('campaigns').firstChild){
                        document.getElementById('campaigns').removeChild(document.getElementById('campaigns').lastChild);
                    }
                }

                campaigns.map(campaign => {
                    let option = document.createElement("option")
                    option.text = campaign.name
                    option.value = campaign.name
                    select.add(option)
                }
                )
            })
    })
    //})
}
addOptions()

//Create a new campaign
const create = () => {
    let create_campaign = document.getElementById('create new campaign')
    let cancel = document.getElementById('cancel create')
    create_campaign.addEventListener('click', () => {
        console.log("click create")
        chrome.runtime.sendMessage({'message':'create campaign'})
        //chrome.storage.local.set({ 'campaignName' : document.getElementById('New campaign Name') })
        let name = document.getElementById('New campaign Name').value
        chrome.storage.local.get(['userUrl'], async userUrl => {
            console.log("create fetch", userUrl.userUrl.value, name)
            await fetch('https://sphaxx-five.vercel.app/api/createCampaign', {
                method:'POST',
                body:JSON.stringify({ cookie:userUrl.userUrl.value, name })
            })
            create_campaign.hidden = true
            cancel.hidden = true
            create_btn.hidden = false
            document.getElementById("New campaign Name").hidden = true
            let option = document.createElement("option")
            option.text = name
            option.value = name
            select.add(option)
            /*chrome.cookies.get({"name":"userUrl", "url":"https://sphaxx-five.vercel.app/"}, (user_url) => {
                chrome.storage.local.set({ "userUrl": user_url })
                console.log("user url : ", user_url.value)
                fetch('https://sphaxx-five.vercel.app/api/getCampaigns', {
                    method:"POST",
                    body:JSON.stringify(user_url.value)
                }).then(data => data.json())
                    .then( data => {
                        console.log('data : ', data.data) 
                        const campaigns = data.data
                        console.log(campaigns)
                        for(let i of select){
                            console.log(i)
                            select.remove(i)
                        }
                        campaigns.map(campaign => {
                            let option = document.createElement("option")
                            option.text = campaign.name
                            option.value = campaign.name
                            select.add(option)
                        })
                        
                    })
            })*/
        })
    
    })
}
scrapeState()


/*create_btn.addEventListener('click', ()=>{
    create_btn.hidden = true
    const newCampName = document.createElement("input")
    const addCamp = document.createElement("button")
    const cancel = document.createElement("button")
    newCampName.type = "text"
    newCampName.placeholder = "New campaign Name"
    newCampName.id = "New campaign Name"
    addCamp.innerText = 'Create New Campaign'
    addCamp.id = 'create new campaign'
    cancel.innerText = 'Cancel'
    cancel.id = 'cancel create'
    document.getElementsByClassName('select')[0].appendChild(newCampName)
    document.getElementsByClassName('select')[0].appendChild(addCamp)
    document.getElementsByClassName('select')[0].appendChild(cancel)
    create()
    console.log("value selected : ",select.value)
    chrome.storage.local.set({'number': input.value, 'campaign':select.value})
    chrome.storage.local.get(['number','campaign'], (all) => {
        console.log('from storage : ', all)
        const {number, campaign} = all
        console.log(number, campaign)
    })
    cancel.addEventListener('click', () => {
        newCampName.hidden = true
        cancel.hidden = true
        addCamp.hidden = true
        create_btn.hidden = false
    })*/
    /*addCamp.addEventListener('click', () => {
        newCampName.hidden = true
        cancel.hidden = true
        addCamp.hidden = true
        create_btn.hidden = false
        chrome.cookies.get({"name":"userUrl", "url":"https://sphaxx-five.vercel.app/"}, (user_url) => {
            chrome.storage.local.set({ "userUrl": user_url })
            console.log("user url : ", user_url.value)
            fetch('https://sphaxx-five.vercel.app/api/getCampaigns', {
                method:"POST",
                body:JSON.stringify(user_url.value)
            }).then(data => data.json())
                .then( data => {
                    console.log('data : ', data.data) 
                    const campaigns = data.data
                    console.log(campaigns)
                    for(let i of select){
                        console.log(i)
                        i.remove()
                    }
                    campaigns.map(campaign => {
                        //let option = document.createElement("option")
                        option.text = campaign.name
                        option.value = campaign.name
                        select.add(option)
                    }
                    )
                })
        })

    })*/
//})

//When "import" btn is clicked
btn.addEventListener('click', () => {
    console.log("this is select value : ",document.getElementById('campaigns').value)
    if(document.getElementById('campaigns').value !== "null"){
        chrome.tabs.query({active:true, currentWindow:true}, async res => {
            const selectValue = select.value
            console.log(selectValue)
            chrome.storage.local.set({'response':res,'number': input.value, 'campaign':selectValue})
            console.log('message sent : ', selectValue)
            chrome.runtime.sendMessage({'message': 'res'})
            //document.getElementById('container').hidden = true
            //document.getElementById('loader').hidden = false
    
        })
    }else{
        console.log("no campaign selected : ", )
        let errorMessage = document.createElement("p")
        let text = document.createTextNode("Error : You must select a campaign first")
        errorMessage.appendChild(text)
        errorMessage.style.color = "red"
        document.getElementById('importation').appendChild(errorMessage)
    }
})

//Listen for change in scraping state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("message from import prospects  : ", request.message)
    if(request.message === 'Import proceed' || request.message === 'scraping state changed'){
        console.log("if statement")
        //document.getElementById('container').hidden = false
        //document.getElementById('loader').hidden = true
        scrapeState()
    }
})

const select = document.getElementById('campaigns')

//Change innerHTML of extension if current tab is not a linkedin search
chrome.runtime.sendMessage({message : "extension clicked"})
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'current tab set in local'){
        chrome.storage.local.get('currentTab', currentTab => {
            console.log("this si current tab : ", currentTab, currentTab.currentTab.url)
            if(!currentTab.currentTab.url.includes('https://www.linkedin.com/search/results/people/')){
                document.getElementById('select').innerHTML = "<button id='linkedinSearchTab'>Open a Linkedin Search tab<button/>"
                document.getElementById('linkedinSearchTab').addEventListener('click', () => {
                    console.log("linkedin search tab clicked")
                    chrome.runtime.sendMessage({ message: 'linkedin search tab btn clicked' })
                    chrome.storage.local.get(['userUrl'], userUrl => {
                        if(userUrl == null || userUrl == undefined){
                            chrome.runtime.sendMessage({'message':'set launch to true'})
                        }
                    })

                })
            }
        })
    }
})

//Open modal when createCampaign btn is clicked
document.getElementById('createCampaign').addEventListener('click', () => {
    console.log("create campaign btn clicked ")
    document.getElementById('modal').style.display = 'block'
})

//Close modal when cancel btn is clicked
document.getElementById('modalCancel').addEventListener('click', () => {
    console.log("create campaign btn clicked ")
    document.getElementById('modal').style.display = 'none'
})

//Close modal when user click outside of the modal
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = "none";
    }
}

//Create campaign when modalOk btn is clicked
document.getElementById('modalOk').addEventListener('click', () => {
    if(document.getElementById('modalNewName').value.trim() !== ''){
        console.log("valid create campaign btn clicked ")
        document.getElementById('modal').style.display = 'none'
        let create_campaign = document.getElementById('modalOk')
        let cancel = document.getElementById('cancel create')
        let name = document.getElementById('modalNewName').value
        chrome.storage.local.get(['userUrl'], async userUrl => {
            console.log("create fetch", userUrl.userUrl.value, name)
            await fetch('https://sphaxx-five.vercel.app/api/createCampaign', {
                method:'POST',
                body:JSON.stringify({ cookie:userUrl.userUrl.value, name })
            })
            let option = document.createElement("option")
            option.text = name
            option.value = name
            select.add(option)
        })        
    }else{
        if(!document.getElementById('errorMessage')){
            let p = document.createElement('p')
            p.setAttribute('id','errorMessage')
            let text = document.createTextNode('Error : Campaign name unvalid')
            p.appendChild(text)
            p.style.color = 'red'
            p.style.margin = '0px'
            document.getElementsByClassName('modalInputsFirstDiv')[0].appendChild(p)
            document.getElementById('modalNewName').style.borderColor = 'red'
            document.getElementById('modalNewName').style.boxShadow = '0 0 5px rgb(244, 67, 67)'
            //document.getElementsByClassName('modalContent')[0].innerHTML += '<p>Error : Campaign name unvalid</p>'
        }
    }
})

/**/
const launchBtn = document.getElementById('launch')

//Refresh btn to launch auth
/*refresh_btn.addEventListener('click', () => {
    console.log("azaezaez")
    chrome.runtime.sendMessage({'message':'set launch to true'})
})*/

//Launch auth when "go to dashboard" is clicked
document.getElementById('dashboard').addEventListener('click', () => {
    console.log("azaezaez")
    chrome.runtime.sendMessage({'message':'set launch to true'})
})

/*
linkedin_auth_btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({'message':'linkedinAuth'})
})*/

/*start_connect.addEventListener('click', () => {
    chrome.runtime.sendMessage({'message':'start connect'})
})*/

//Launch "LaunchScript" when "Launch" btn is clicked
/*launchBtn.addEventListener('click', () => {
    console.log("launch clicked")
    chrome.runtime.sendMessage({'message':'launch script locally'})
})*/

//Launch "personalStats" when "personal stats" btn is clicked
/*document.getElementById('personalStats').addEventListener('click', () => {
    console.log("personal stats")
    chrome.runtime.sendMessage({'message':'launch personal stats'})
})*/

/*if(!!document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')){
        console.log("connect btn exist")
        document.querySelector('.pv-s-profile-actions.pv-s-profile-actions--connect.ml2.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view').click()
    }*/


/*chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    console.log(request)
})
//localStorage.setItem("username", "John");
chrome.storage.local.get("valid_url", value =>{
    console.log(value)
    if(value.valid_url){
        
        console.log("if statement")
        linkedin_profiles = document.getElementsByClassName("reusable-search__result-container ")
        console.log(linkedin_profiles)
        
        let data = []

        for(i=0;i<linkedin_profiles.length;i++){
            let name = document.querySelector(`body > div.application-outlet > div.authentication-outlet > div > div.neptune-grid.two-column.search-marvel-srp > div > div > div > div:nth-child(2) > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`).textContent
            
            let url = document.querySelector(`body > div.application-outlet > div.authentication-outlet > div > div.neptune-grid.two-column.search-marvel-srp > div > div > div > div:nth-child(2) > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`).href

            data = [...data, {"name":name,"url":url}]
            console.log(data) 
        }
        
        
    }
})*/

