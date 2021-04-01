import React, { useEffect } from 'react';

export default function ProspectCard({ prospect, handleCheck,campaignHasChanged, isCheckAll, index, campaign, two, changed }){
    useEffect(() => {
        Array.from(document.getElementsByClassName('checkboxProspect')).forEach(el =>  {
            el.checked = false
        })
    }, [campaignHasChanged])
    useEffect(() => {
        Array.from(document.getElementsByClassName('checkboxProspect')).forEach(el =>  {
            el.checked = isCheckAll
        })
    }, [isCheckAll])
    useEffect(() => {
        Array.from(document.getElementsByClassName('checkboxProspect')).forEach(el =>  {
            el.checked = false
        })
    }, [changed])

    //{prospect.isConnected == true ? (prospect.hasAccepted && prospect.hasAccepted == true ? 'Connected' : 'Connection in hold' ) : 'Connection not send'}<br/>{prospect.hasAccepted ? (prospect.hasResponded ? 'Has responded' : 'Has not responded yet' ) : ''}
    return (
            <tr className="">
                <td>
                    <input onClick={handleCheck} className="checkboxProspect" type="checkbox" id="checkbox" value={prospect.url ? prospect.url : prospect.prospectUrl} name={prospect.name ? prospect.name : prospect.prospectName} placeholder={prospect.campaign} />
                </td>
                <td>
                    {prospect.prospectName ? prospect.prospectName : prospect.name}
                </td>
                {two ? 
                    <td className="break-all">
                    {prospect.prospectUrl && campaign=='All' ? `Launch in ${3*(index+1)} to ${5*(index+1)} minutes` : "See 'All' campaign to know wich action will be next"}
                    <br/>{prospect.prospectUrl ? prospect.prospectUrl : prospect.url}
                    </td> :
                    <td className="break-all">
                        {prospect.prospectUrl ? prospect.prospectUrl : prospect.url}
                    </td>
                }
                <td>
                    {prospect.isConnected ? "Connection send" : "Connection not send"}<br/>
                    {prospect.hasAccepted ? "Connected" : (prospect.isConnected ? "Connection in hold" : "/" ) }<br/>
                    {prospect.hasResponded ? "Has responded" : "Has not responded yet"}
                </td>
                <td>
                    {prospect.campaign}
                </td>
            </tr>
           
    )
}