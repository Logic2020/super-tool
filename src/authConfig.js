import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */

export const msalConfig = {
    auth: {
        // ID of the "super-tool" app in azure app registrations
        clientId: "87c05ad0-62d3-41c8-b815-2f3cd009ac99",
        authority: "https://login.microsoftonline.com/common",
        // use localhost for local development
        redirectUri: "http://localhost:3000/"
        // redirectUri: "https://d58cyh9eofbyu.cloudfront.net"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case LogLevel.Warning:		
                        console.warn(message);		
                        return;
                    default:
                        console.info(message);		
                        return;
                }	
            }	
        }	
    }
};

/**
 * Need read access to Power BI
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["https://analysis.windows.net/powerbi/api/Dataset.Read.All"]
};

// ID of the workspace containing the data set
const superToolDatasetGroupID = "9fccabdc-6d8e-4c5c-89de-92976f771206"

// ID of super tool dataset in power BI
const superToolDatasetID = "f0deff0f-b758-4403-848e-b6c193e21059"

// endpoint used to pull data from power BI
export const powerBIQueryAPI = {
    executeQueryEndpoint: `https://api.powerbi.com/v1.0/myorg/groups/${superToolDatasetGroupID}/datasets/${superToolDatasetID}/executeQueries`
};
