import React, { useEffect, useState } from 'react'
import ProspectList from './ProspectList'

export default function Scenario(props){

    return (
        <div>
            <h1>Scenario</h1>
            <div className="my-2">
                <button className="bg-red-300 p-2 m-1 rounded">Add Connect Request Step</button>
                <button className="bg-purple-300 p-2 m-1 rounded">Add Message Step</button>
            </div>
            <ul className="bg-red-200 rounded p-4">
                <li>Connect <button className="bg-red-500 p-1 mx-2 rounded">X</button></li>
                <li>Message : x Days after last step <button className="bg-red-500 p-1 mx-2 rounded">X</button> </li>
                <li>Message : x Days after last step <button className="bg-red-500 p-1 mx-2 rounded">X</button></li>
            </ul>
            <div className="mt-12">
                <button className="bg-purple-300 p-2 m-2 ml-0 rounded">Save Scenario</button>
                <button className="bg-indigo-600 p-2 m-2 mr-0 rounded text-white">Save & Launch Scenario</button>
            </div>
        </div>
    )
}