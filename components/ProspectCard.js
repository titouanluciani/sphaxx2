import React, { useEffect } from 'react';

export default function ProspectCard({ prospect, handleCheck,campaignHasChanged }){
    useEffect(() => {
        Array.from(document.getElementsByClassName('checkboxProspect')).forEach(el =>  {
            el.checked = false
        })
    }, [campaignHasChanged])
    return (
            <tr className="border-gray-300">
                <td>
                    <input onClick={handleCheck} className="checkboxProspect" type="checkbox" value={prospect.url}/>
                </td>
                <td>
                    {prospect.name}
                </td>
                <td className="break-all">
                    {prospect.url}
                </td>
            </tr>
           
    )
}