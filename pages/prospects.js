import { React, useEffect, useState } from 'react'
import ProspectList2 from '../components/ProspectList2'

export default function Prospects({cookie, cookiesSession}){
    const [prospects, setProspects] = useState([]) 
    const [campaign, setCampaign] = useState('')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [changed, setChanged] = useState(true)
    const prospectPage = true

    const loadProspects = async (campaign, cookie) => {
        try{
            if(campaign == 'All'){
                const res = await fetch(`/api/campaigns`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects, notes, messages} = await res.json();
                setProspects(prospects.data) 

            }else{
                const res = await fetch(`/api/campaigns/${campaign}`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects, notes, messages} = await res.json();
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
        console.log("e target : ", e.target)
        if(e.target.checked){
            setSelectedProspects(selectedProspects => selectedProspects.concat({'url':e.target.value, 'name':e.target.name, 'campaign':e.target.placeholder}))
        }else{
            setSelectedProspects(selectedProspects.filter(el => el.url !== e.target.value))
        }
    }
    const handleCheckAll = (e) => {
        if(e.target.checked){
            setSelectedProspects([])
            setSelectedProspects(selectedProspects.concat(prospects.map(prospect => new Object({'url':prospect.prospectUrl, 'name':prospect.prospectName, 'campaign':prospect.campaign}))))
            setIsCheckAll(true)
        }else{
            setSelectedProspects([])
            setIsCheckAll(false)
        }
        console.log("handlecheckAll : ", isCheckAll)
    }
    const handleDelete = async () => {
        console.log("delete : ",selectedProspects, campaign)
        await fetch('https://sphaxx-five.vercel.app/api/DeleteProspects', {
            mode: 'no-cors',
            method: 'POST',
            body:JSON.stringify({cookie, selectedProspects})
        })
        setChanged(!changed)
        await loadProspects(campaign, cookie)
        setSelectedProspects([])
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
        <div className="flex flex-col h-screen ml-48 p-4">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => (
                            <option value={campaign.name}>{campaign.name}</option>
                        ))}
                        <option value="All">All</option>
                    </select>
            <ProspectList2 prospects={prospects} handleCheck={handleCheck} handleCheckAll={handleCheckAll} handleDelete={handleDelete} campaignHasChanged={campaignHasChanged} prospectPage={prospectPage} />

        </div>
    )
}