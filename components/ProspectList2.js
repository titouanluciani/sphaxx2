import React, { useEffect, useState } from 'react';
import ProspectCard from './ProspectCard'
import Pagination from './Pagination'

export default function ProspectList2({ prospects, handleCheck, campaignHasChanged, handleCheckAll, isCheckAll,handleDelete, campaign, two, changed, prospectPage }){
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
        <div className="h-full w-full mb-4">
            <h2> {prospectPage ? "Prospect List" : "Waiting Line List" } </h2>
            <button onClick={handleDelete} className="bg-red-400 py-2 px-3 rounded my-3">{prospectPage ? "Delete Prospect" : "Delete Action" }</button>
            <Pagination paginate={paginate} rowsPerPage={rowsPerPage} totalProspects={prospects.length} />

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
                            <th scope="">
                                Action
                            </th>
                            <th className="">
                                Campaign
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overflow-x-hidden overflow-y-auto bg-blue-200 mb-4">
                                { currentProspects && currentProspects.map(prospect =>(
                                    <ProspectCard key={prospect._id} prospect={ prospect } handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} isCheckAll={isCheckAll} index={prospects.indexOf(prospect)} campaign={campaign} two={two} changed={changed} />
                                )) }
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}