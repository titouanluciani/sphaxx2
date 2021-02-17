import React from 'react';
import ProspectCard from './ProspectCard'

export default function ProspectList({ prospects, handleCheck, campaignHasChanged, handleCheckAll, isCheckAll }){
    return(
        <div className="h-full w-6/12 mb-4">
            <h2>Prospect List</h2>
            <div className="h-full pb-4">
                <table className="border-collapse table-fixed w-full my-6 text-sm h-full rounded overflow-hidden shadow-md">
                    <thead className="table table-fixed w-full">
                        <tr className="bg-red-400 text-white block font-bold">
                            <th>
                                <input type="checkbox" onClick={handleCheckAll} name="" id=""/>
                            </th>
                            <th className="text-right">
                                Name
                            </th>
                            <th scope="col">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overflow-x-hidden block h-screen border-black bg-blue-200 border-2 mb-4">
                                { prospects && prospects.map(prospect =>(
                                    <ProspectCard key={prospect._id} prospect={ prospect } handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} isCheckAll={isCheckAll} />
                                )) }
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}