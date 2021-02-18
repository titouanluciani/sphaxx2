import React from 'react';
import ProspectCard from './ProspectCard'

export default function ProspectList({ prospects, handleCheck, campaignHasChanged, handleCheckAll, isCheckAll }){
    return(
        <div className="h-full w-6/12 mb-4">
            <h2>Prospect List</h2>
            <div className="h-full pb-4">
                <table className="border-collapse my-6 text-sm w-full rounded overflow-x-hidden shadow-md">
                    <thead className="">
                        <tr className="bg-red-400 text-white font-bold">
                            <th>
                                <input type="checkbox" onClick={handleCheckAll} name="" id=""/>
                            </th>
                            <th className="text-right">
                                Name
                            </th>
                            <th scope="col">
                                Url
                            </th>
                            <th className="text-right">
                                Action
                            </th>
                            <th scope="col">
                                Campaign
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overflow-x-hidden border-black bg-blue-200 border-2 mb-4">
                                { prospects && prospects.map(prospect =>(
                                    <ProspectCard key={prospect._id} prospect={ prospect } handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} isCheckAll={isCheckAll} />
                                )) }
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}