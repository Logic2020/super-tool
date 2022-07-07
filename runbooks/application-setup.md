## Overview

How to setup the application in Azure to use with authentication.

## Setup

1. open `app-registrations`, and select `New Registration`
2. fill out JUST these fields:
   * Name: `super-tool`
   * Supported account types: `Accounts in any organizational directory (Any Azure AD directory - Multitenant)`
3. select `Register` button
4. from `Redirect URIs` select `Add a Redirect URI`
5. under `Platform configurations` select `Add a platform`
6. choose `Platform configurations` then select `Single-page application`
7. in `Redirect URIs` enter `https://d58cyh9eofbyu.cloudfront.net`
8. from left nav bar, select `API permissions` and choose `Add a permission`
9. choose `Power BI Service`, then choose `Dataset.Read.All`
10. remove the `Microsoft Graph` `User.Read` permission