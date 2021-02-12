import React, { useEffect, useState } from 'react'
import ProspectList2 from '../components/ProspectList2'

export default function Prospects({cookie, cookiesSession}){
    const [prospects, setProspects] = useState([]) 
    const [campaign, setCampaign] = useState('')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)


    const loadProspects = async (campaign, cookie) => {
        try{
            if(campaign == 'All'){
                const res = await fetch(`/api/waitingLines`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects} = await res.json();
                console.log(prospects) 
                setProspects(prospects.data) 

            }else{
                const res = await fetch(`/api/waitingLines/${campaign}`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects} = await res.json();
                setProspects(prospects)
                setProspects(prospects.data)
            }

        }catch(err){
            console.error(err)
        }
    }
    const loadCampaigns = async (cookie) => {
        const res = await fetch('/api/getCampaigns',{
            method:'POST',
            body: JSON.stringify(cookie)
        })
        const res_campaigns = await res.json();
        setCampaigns(res_campaigns.data)
    }
    const handleCampaigns = (e) => {
        setCampaign(e.target.value)
        setSelectedProspects([])
        setCampaignHasChanged(prev => !prev)
    }
    const handleCheck = (e) => {
        if(e.target.checked){
            setSelectedProspects(selectedProspects => selectedProspects.concat([e.target.value]))

        }else{
            setSelectedProspects(selectedProspects.filter(el => el !== e.target.value))

        }
    }


    useEffect(() => {
        console.log("cookie for useEffect loadprosp loadcamp : ", cookie)
        console.log("cookiesSession for useEffect loadprosp loadcamp : ", cookiesSession)
        loadProspects(campaign, cookie);
        loadCampaigns(cookie);
    }, [cookie, cookiesSession])
    useEffect(() => {
        loadProspects(campaign, cookie);
    }, [campaign])
    return (
        <div className="flex flex-col border-black border-4 h-screen ml-48 p-4">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => (
                            <option value={campaign.name}>{campaign.name}</option>
                        ))}
                        <option value="All">All</option>
                    </select>
            <ProspectList2 prospects={prospects} handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} />

        </div>
    )
}