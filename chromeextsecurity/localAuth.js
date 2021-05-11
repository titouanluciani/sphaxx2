const delay = (time) => {
    return new Promise(function(resolve){
        setTimeout(resolve, time)
    })
}

console.log(!document.cookie.match(/^(.*;)?\s*userUrl\s*=\s*[^;]+(.*)?$/))
    /*if(document.querySelector('.global-nav__primary-link.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view')){
        document.querySelector('.global-nav__primary-link.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view').click()
    }else if(document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view')){
        document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view').click()
    }else if(document.querySelector('.global-navprimary-link.artdeco-dropdown___trigger.artdeco-dropdowntrigger--placement-bottom.ember-view')){
        document.querySelector('.global-navprimary-link.artdeco-dropdown___trigger.artdeco-dropdowntrigger--placement-bottom.ember-view').click()
    }else if(document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view')){
        document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view').click()
    }*/
    //await delay(1500)
    /*setTimeout(()=>{
        console.log(!document.querySelector('.active.ember-view.link-without-hover-state'))
        const url = document.querySelector('.active.ember-view.link-without-hover-state') ? document.querySelector('.active.ember-view.link-without-hover-state').href : document.querySelector('.ember-view.link-without-hover-state').href
        if(!url){
            let popup = document.querySelector('.artdeco-dropdowncontent-inner')
            url = popup.querySelector('a').href
        }
        console.log(url)*/
        /*await document.cookies.get({"url":"https://www.linkedin.com/","name":"li_at"}, async cookiesSession=> {
            chrome.storage.local.set({ "cookiesSession":cookiesSession })
        })*/
        /*chrome.storage.local.set({ "userUrl":url })
        chrome.runtime.sendMessage({'message':'got the user url'})
        document.cookie = `userUrl=${url}`
    } ,1000)
    console.log("seeaercch : ", !document.querySelector('.global-nav__primary-link.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view'))*/

const f = async () => {
    /*if(document.querySelector('.global-nav__primary-link.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view')){
        document.querySelector('.global-nav__primary-link.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.ember-view').click()
    }else if(document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view')){
        document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view').click()
    }else if(document.querySelector('.global-navprimary-link.artdeco-dropdown___trigger.artdeco-dropdowntrigger--placement-bottom.ember-view')){
        document.querySelector('.global-navprimary-link.artdeco-dropdown___trigger.artdeco-dropdowntrigger--placement-bottom.ember-view').click()
    }else if(document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view')){
        document.querySelector('.global-navprimary-link.artdeco-dropdowntrigger.artdeco-dropdowntrigger--placement-bottom.ember-view').click()
    }*/
    try{

        await delay(3000)
        document.querySelector('.profile-rail-card__actor-link.t-16.t-black.t-bold').click()
        await delay(1000)
        console.log(location.href)
        let name = ""
        const imgUrl = document.querySelector('.profile-photo-edit__preview.ember-view').src
        if(document.querySelector('.text-heading-xlarge.inline.t-24.v-align-middle.break-words')){
            name = document.querySelector('.text-heading-xlarge.inline.t-24.v-align-middle.break-words').innerText
        }else{
            name = document.querySelector('.inline.t-24.t-black.t-normal.break-words').innerText
        }
        chrome.storage.local.set({ "userUrl":location.href, "imgUrl":imgUrl, "name":name })
        chrome.runtime.sendMessage({'message':'got the user url'})
         
        window.close()
        //chrome.runtime.sendMessage({"message":"launch personal stats"})
    }catch(e){
        console.log("err in localauth  :", e)
        window.close()
    }
}
f()
