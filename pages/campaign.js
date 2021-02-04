import React, { useEffect, useState } from 'react'
import ProspectList from  '../components/ProspectList'
import TabPanel from '../components/TabPanel'
import Modal from '../components/createCampModal'


export default function Campaign(){
    const [prospects, setProspects] = useState([]) 
    const [notes, setNotes] = useState([]) 
    const [messages, setMessages] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [campaign, setCampaign] = useState('')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([])
    const [showModal, setShowModal] = useState(false)

    const loadProspects = async (campaign) => {
        try{
            const res = await fetch(`/api/campaigns/${campaign}`);
            const {prospects, notes, messages} = await res.json();
            console.log("prospects and notes in loadprospects ",prospects, notes, messages)
            setProspects(prospects.data)
            setNotes(notes.data)
            setMessages(messages.data)

        }catch(err){
            console.error(err)
        }
    }

    const loadCampaigns = async () => {
        const res = await fetch('/api/getCampaigns')
        const campaigns = await res.json();
        setCampaigns(campaigns.data)
    }
    /*
    const loadNote = async (campaign) => {
        const res = fetch('/api/notes/cam')
        const note = res.json()
    }*/

    const handleCampaigns = (e) => {
        setCampaign(e.target.value)
        setSelectedProspects([])
        setCampaignHasChanged(prev => !prev)
        console.log("campaignHasChanged : ", campaignHasChanged)
    }

    const handleCheck = (e) => {
        console.log(e.target.value)
        console.log(e.target.checked)
        if(e.target.checked){
            setSelectedProspects(selectedProspects => selectedProspects.concat([e.target.value]))
            console.log("selected pr after",selectedProspects)

        }else{
            setSelectedProspects(selectedProspects.filter(el => el !== e.target.value))
            console.log("selected pr after",selectedProspects)

        }
    }

    useEffect(() => {
        loadProspects(campaign);
        loadCampaigns();
    }, [])

    useEffect(() => {
        loadProspects(campaign);
    }, [campaign])

    const openModal = () => {
        setShowModal(prev => !prev)
    }

    return(
        <div className="bg-gray-200 p-4 border-black border-4 ml-48 overflow-x-hidden w-full h-screen">
            <Modal showModal={showModal} setShowModal={setShowModal}/>

            <div className="flex flex-row m-2 mb-4 bg-gray-200">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => (
                            <option value={campaign.name}>{campaign.name}</option>
                        ))}
                        <option value="default campaign">Default Campaign</option>
                    </select>
                    <button onClick={openModal} className="p-2 px-3 mr-4 bg-blue-500 rounded">Create</button>
                    <button onClick={() => console.log(selectedProspects)} className="p-2 px-3 mr-4 bg-red-500 rounded">Delete</button>
                    <button className="p-2 px-3 mr-4 bg-blue-500 rounded">Tools</button>
            </div>
            <div className="flex flex-row flex-wrap justify-between h-screen h-full">
                <ProspectList prospects={prospects} handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} />
                <TabPanel notes={notes} messages={messages} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} />
            </div>
            
            
        </div>
    )
}