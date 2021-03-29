import React, { useEffect, useState } from 'react';
import ProspectCard from './ProspectCard'
import Pagination from './Pagination'

export default function ProspectList({ prospects, handleCheck, campaignHasChanged, handleCheckAll, isCheckAll, handleCheckFilter, loadingProspects }){

    //Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [previousPage, setPreviousPage] = useState(1)

    const indexOfLastItem = rowsPerPage * currentPage
    const indexOfFirstItem = indexOfLastItem - rowsPerPage
    const currentProspects = prospects.slice(indexOfFirstItem, indexOfLastItem)

    //Change page
    const paginate = (e,pageNumber) => {
        console.log("e of paginate ",e.target)
        console.log("e of paginate ",previousPage)
        
        //if(currentPage == )
        if(currentPage !== 1){
            console.log("remove prev")
            previousPage.classList.remove('active')
        }else{
            console.log("remove first : ",document.querySelector('.pageBtn') )
            document.querySelector('.pageBtn').classList.remove('active')
        }
        e.target.classList.add('active')
        setPreviousPage(e.target)
        setCurrentPage(pageNumber)
    }
    
    useEffect(() => {
        console.log("PROSPECTS IN PROSPECT LIST : ", prospects)
        console.log("PROSPECTS IN PROSPECT LIST : ", currentProspects)
    }, [currentProspects])
    return(
        <div className="h-full w-6/12 mb-4">
            <h2>Prospect List</h2>
            <Pagination paginate={paginate} rowsPerPage={rowsPerPage} totalProspects={prospects.length} />
            <div className="">
                <input type="checkbox" id="Connection not send" name="isNotConnected" onClick={handleCheckFilter} />
                <label className="mr-4" for="Connection not send">Connection not send</label>

                <input type="checkbox" id="Connection send" name="isConnected" onClick={handleCheckFilter} />
                <label className="mr-4" for="Connection send">Connection send</label>

                <input type="checkbox" id="Connection in hold" name="hasNotAccepted" onClick={handleCheckFilter} />
                <label className="mr-4" for="Connection in hold">Connection in hold</label>

                <input type="checkbox" id="Connected" name="hasAccepted" onClick={handleCheckFilter} />
                <label className="mr-4" for="Connected">Connected</label><br/>

                <input type="checkbox" id="Has not responded" name="hasNotResponded" onClick={handleCheckFilter} />
                <label className="mr-4" for="Has not responded">Has not responded</label>
                
                <input type="checkbox" id="Has responded" name="hasResponded" onClick={handleCheckFilter} />
                <label for="Has responded">Has responded</label>
            </div>
            <div className="h-full pb-4">
                <table data-pagecount="3" className="pagination border-collapse my-6 text-sm w-full rounded overflow-x-hidden shadow-md">
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
                    <tbody className="overflow-x-hidden bg-blue-200 mb-4">
                                { currentProspects && currentProspects.map(prospect =>(
                                    <ProspectCard key={prospect._id} prospect={ prospect } handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} isCheckAll={isCheckAll} />
                                )) }
                    </tbody>
                </table>
            </div>
            
        </div>
    )

}