import { React, useEffect, useState } from 'react';

export default function Dashboard({ cookie, cookiesSession }){
    const [campaign, setCampaign] = useState('Default Campaign')
    const [campaigns, setCampaigns] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [acceptanceRate, setAcceptanceRate] = useState(0)
    
    const monitore = async () => {
        /*await fetch('/api/monitoring', {
            method:'POST',
            body:JSON.stringify({ cookie, cookiesSession})
          })*/
    }
    const loadCampaigns = async (cookie) => {
        const res = await fetch('/api/getCampaigns',{
            method:'POST',
            body: JSON.stringify(cookie)
        })
        const res_campaigns = await res.json();
        setCampaigns(res_campaigns.data)
        console.log("campaigns after loadcampaigns : ",campaigns)
    }
    const handleCampaigns = (e) => {
        setCampaign(e.target.value)
        setCampaignHasChanged(prev => !prev)
    }
    const getRates = async () => {
        const res = await fetch('api/getRates', {
            method: 'POST',
            body: JSON.stringify({ campaign, cookie })
        })
        console.log("response from getRates  : ",res)
        let rates = await res.json()
        setAcceptanceRate(Math.trunc(rates*100))
        console.log("response from getRates 2  : ",rates)
    }
    useEffect(() => {
        console.log("cookie for useEffect loadcamp in dash : ", cookie)
        console.log("cookiesSession for useEffect loadcamp in dash : ", cookiesSession)
        loadCampaigns(cookie);
        //setFilterProspects(selectedProspects)
    }, [cookie, cookiesSession])
    useEffect(() => {
        getRates()
    }, [campaign])
    useEffect(() => {
        console.log("acetpppet rant ", acceptanceRate)
    }, [acceptanceRate])
    return(
        <div className="ml-48 grid grid-cols-3 grid-rows-4 h-screen gap-1">
            <div className="bg-red-300 row-span-2">
                LinkedIn Stats
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn1.iconfinder.com/data/icons/feather-2/24/link-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-eye-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
            </div>
            <div className="bg-blue-300 row-span-2 col-span-2">
                Global Performance
                <button className="inline-block ml-4 mt-2 bg-purple-500 p-1 rounded text-white" onClick={getRates}>Refresh Stats</button>
                <select onChange={handleCampaigns} name="" id="">
                {campaigns.map(campaign => campaign == 'Default Campaign' ? 
                            (
                                <option selected value={campaign.name}>{campaign.name}</option>
                            )
                        : (
                            <option value={campaign.name}>{campaign.name}</option>
                            )
                )}
                </select>
                <div className="">
                    <h2>Acceptance rate : { acceptanceRate } % </h2>
                    <h2>Response rate : {  } </h2>
                </div>
            </div>
            <div className="bg-green-300 col-span-full row-span-2">
                Activity Report
            </div>
        </div>

    )
}