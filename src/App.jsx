import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { ExecuteQuery, NormalizeData} from "./PowerBi";
import Button from "react-bootstrap/Button";
import "./styles/App.css";
import OuterTabs from './OuterTabs';
import Typography from '@mui/material/Typography';

const AuthenticatedContent = () => {
    const { instance, accounts } = useMsal();
    const [accountData, setAccountData] = useState(null);
    const [allSegments, setAllSegments] = useState(null);
    const [allSalespersons, setAllSalespersons] = useState(null);
    const [allEffectiveDates, setAllEffectiveDates] = useState(null);
    const [allPracticeAreas, setAllPracticeAreas] = useState(null);

    function RequestAccountData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            ExecuteQuery(response.accessToken).then(response => {
              let normalizedAccountData = NormalizeData(response)
              if (normalizedAccountData) {
                setAccountData(normalizedAccountData.data)
                setAllSegments(normalizedAccountData.allSegments)
                setAllSalespersons(normalizedAccountData.allSalespersons)
                setAllEffectiveDates(normalizedAccountData.allEffectiveDates)
                setAllPracticeAreas(normalizedAccountData.allPracticeAreas)
                console.log(`loaded ${normalizedAccountData.data.length} rows`)
              } else {
                console.log("could not load account data")
              } 
            });
        });
    }

    return (
        <>
            { (accountData && allSegments && allSalespersons && allEffectiveDates && allPracticeAreas) ? 
                <OuterTabs accountData={accountData} 
                           allSegments={allSegments} 
                           allSalespersons={allSalespersons}
                           allEffectiveDates={allEffectiveDates}
                           allPracticeAreas={allPracticeAreas}/>
                :
                <Button variant="secondary" onClick={RequestAccountData}>Load Account Data From PowerBi</Button>
            }
        </>
    );
};

/**
 * If a user is authenticated the AuthenticatedContent component above is rendered. 
 * Otherwise a message indicating a user is not authenticated is rendered.
 */
export default function App() {
    return (
        <PageLayout>
          <div className="App">
              <AuthenticatedTemplate>
                  <AuthenticatedContent />
              </AuthenticatedTemplate>

              <UnauthenticatedTemplate>
                  <Typography>Please sign-in to analyze data provided by Power BI</Typography>
              </UnauthenticatedTemplate>
          </div>
        </PageLayout>
    );
}
