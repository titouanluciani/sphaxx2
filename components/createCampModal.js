import React, { useEffect, useState } from 'react'

export default function Modal({ showModal, setShowModal}){
    console.log("shoow mdoal ",showModal)
    
    const [name, setName] = useState('')
    const handleName = async (e) => {
        console.log(document.getElementById('camp').value)
        setName(document.getElementById('camp').value)
        await createCampaign(name)
        setShowModal(false);
    }
    const createCampaign = async (name) => await fetch('/api/createCampaign', {
        method:'POST',
        body: JSON.stringify({name: name})
    })
    return (
        <div className="h-full left-1/2 bg-blue-300 fixed flex justify-center items-center">
            { showModal ? 
            <div className="bg-blue-100 h-56 w-auto fixed flex flex-col justify-around p-8 justify-center items-center">
                <h1>Create new Campaign</h1>
                <input className="block p-2 rounded" type="text" name="camp" id="camp" label="Name" placeholder="Campaign's name"/>
                <div className="flex flex-row">
                <button onClick={handleName} className="bg-blue-300 p-2 p-x-4 rounded m-2">Valid</button>
                <button className="bg-red-600 p-2 rounded m-2">Cancel</button>
                </div>

            </div>
             : null }
        </div>
    )
}