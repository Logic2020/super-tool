export function handleResponseStatus(status){
    if(status == 404){
        let alert_text = 'Status: 404 \nCould not connect to PowerBI API, Server not found. \nPlease contact your System Administrator for assistance.'
        alert(alert_text)
    }
    else if(status == 403){
        let alert_text = 'Status: 403 \nCould not connect to PowerBI API, Insufficient Permissions. \nPlease contact your System Administrator for assistance.'
        alert(alert_text)
    }
    else if(status == 401){
        let alert_text = 'Status: 401 \nCould not connect to PowerBI API, User not authorized. \nPlease contact your System Administrator for assistance.'
        alert(alert_text)
    }
    else if(status == 400){
        let alert_text = 'Status: 400 \nCould not connect to PowerBI API, Bad Request. \nPlease contact your System Administrator for assistance.'
        alert(alert_text)
    }
}