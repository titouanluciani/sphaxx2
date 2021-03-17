import React, { useEffect, useState } from 'react'
import ProspectList2 from '../components/ProspectList2'

export default function Prospects({cookie, cookiesSession}){
    const [prospects, setProspects] = useState([]) 
    const [campaign, setCampaign] = useState('')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [isCheckAll, setIsCheckAll] = useState(false)

    const loadProspects = async (campaign, cookie) => {
        try{
            if(campaign == 'All'){
                const res = await fetch(`/api/waitingLines`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {waitingLine} = await res.json();
                console.log(waitingLine) 
                setProspects(waitingLine.data) 

            }else{
                const res = await fetch(`/api/waitingLines/${campaign}`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {waitingLine} = await res.json();
                setProspects(waitingLine.data)
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
            setSelectedProspects(selectedProspects => selectedProspects.concat({'url':e.target.value, 'name':e.target.name}))
        }else{
            setSelectedProspects(selectedProspects.filter(el => el !== e.target.value))
        }
    }
    const handleCheckAll = (e) => {
        if(e.target.checked){
            setSelectedProspects(prospects.map(prospect => prospect.url))
            setIsCheckAll(true)
        }else{
            setSelectedProspects([])
            setIsCheckAll(false)
        }
        console.log("handlecheckAll : ", isCheckAll)
    }


    useEffect(() => {
        console.log("cookie for useEffect loadprosp loadcamp : ", cookie)
        loadProspects(campaign, cookie);
        loadCampaigns(cookie);
    }, [cookie, cookiesSession])
    useEffect(() => {
        loadProspects(campaign, cookie);
    }, [campaign])
    useEffect(() => {
        console.log(selectedProspects)
    }, [selectedProspects])
    return (
        <div className="flex flex-col h-screen ml-48 p-4">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => (
                            <option value={campaign.name}>{campaign.name}</option>
                        ))}
                        <option value="All">All</option>
                    </select>
            <ProspectList2 prospects={prospects} handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} handleCheckAll={handleCheckAll} isCheckAll={isCheckAll} />

        </div>
    )
}