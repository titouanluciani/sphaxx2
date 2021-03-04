import React from 'react';
import ProspectCard from './ProspectCard'

export default function ProspectList({ prospects, handleCheck, campaignHasChanged, handleCheckAll, isCheckAll, handleCheckFilter }){
    return(
        <div className="h-full w-6/12 mb-4">
            <h2>Prospect List</h2>
            <div className="">
                <input type="checkbox" id="Connection not send" name="isNotConnected" onClick={handleCheckFilter} />
                <label for="Connection not send">Connection not send</label>
                <input type="checkbox" id="Connection send" name="isConnected" onClick={handleCheckFilter} />
                <label for="Connection send">Connection send</label>
                <input type="checkbox" id="Connection in hold" name="hasNotAccepted" onClick={handleCheckFilter} />
                <label for="Connection in hold">Connection in hold</label>
                <input type="checkbox" id="Connected" name="hasAccepted" onClick={handleCheckFilter} />
                <label for="Connected">Connected</label>
                <input type="checkbox" id="Has not responded" name="hasNotResponded" onClick={handleCheckFilter} />
                <label for="Has not responded">Has not responded</label>
                <input type="checkbox" id="Has responded" name="hasResponded" onClick={handleCheckFilter} />
                <label for="Has responded">Has responded</label>
            </div>
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
                                Actions
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