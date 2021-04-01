import React from 'react';
import ProspectCard from './ProspectCard'

export default function ProspectList2({ prospects, handleCheck, campaignHasChanged, handleCheckAll, isCheckAll,handleDelete, campaign, two }){
    return(
        <div className="h-full w-full mb-4">
            <h2>Prospect List</h2>
            <button onClick={handleDelete} className="bg-red-400 py-2 px-3 rounded">Delete Action</button>

            <div className="h-full pb-4">
                <table className="border-collapse my-6 text-sm w-full rounded overflow-x-hidden shadow-md">
                    <thead className="">
                        <tr className="bg-red-400 text-white font-bold">
                            <th>
                                <input type="checkbox" name="" id="" onClick={handleCheckAll}/>
                            </th>
                            <th className="text-right">
                                Name
                            </th>
                            <th scope="col">
                                Status
                            </th>
                            <th scope="border-black border-2">
                                Action
                            </th>
                            <th className="border-black border-2">
                                Campaign
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overflow-x-hidden overflow-y-auto bg-blue-200 mb-4">
                                { prospects && prospects.map(prospect =>(
                                    <ProspectCard key={prospect._id} prospect={ prospect } handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} isCheckAll={isCheckAll} index={prospects.indexOf(prospect)} campaign={campaign} two={two} />
                                )) }
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}