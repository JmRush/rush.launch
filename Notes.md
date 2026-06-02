# MVP - Rush launch

## Application Overview
    -Navbar - login/logout, dashboard redirect
    - Secure login
    - Form validation/safety - login, container/server creator
    - Both dashboards
        - Carrousel of available servers to launch at the top under nav bar


## Admin page
    - Tool to actually add approved containers (start small and expand when people ask)
        - Minecraft vanilla
        - Minecraft with mod support
        - Cs2 servers
        - Asetto corsa competitizone server
    - User creation
    - Privileged Docker server creation
    - Dashboard
        - View ALL active servers, and have controls available for them
        - Overall stats, connections, last used, resource utilization etc



## User page
    - Whitelisted Docker server creation - from a list of approved containers
    - Self-created server controls within reason (safety requirements) stop/start/restart (Maybe update off of current branch?)
    - Dashboard
        - Shows active servers that they created underneath




Last working on:

- Auth context provider (front-end)
- Auth error handling (redirect based on invalid token -> relogin)
- Storing server data types 
- Front-end design

Want to complete:
- (post) Create server handler
- (get) active server data handler
- RBA on paths (currently not implemented) - thinking of several methods (not sure yet)







# Flows

## Auth flow - Goal
- Public login page calls useAuth/Login
- login hits server handlerLogin
- Server validates user from auth query
- Refresh token stored in db
- We send back a jwt token, and a refresh
- Protected layout checks if a user is logged in, and stores the data for dynamic display reasons


## Current Auth flow (mess)

- User gets login page (public)
- User inputs email and password
- Server calls handlerLogin which verifies pass/email
- If valid, we create a JWT/Refresh token
- We store refresh token in db
- we send back both tokens
- If invalid, we do nothing

- If user tries to acccess a page that is not correct or an API endpoint that is not accessible to them (unauth)
- we redirect them back to login
- Otherwise we send them the requested data.

## Auth is missing 
- Refresh token implementation
- front end auth context
- logout -> invalidate refresh token -> remove tokens from cookies???? - we must do research on what happens when we press logout.

## Questions about auth 

- How do we know when to check if a token is expired?
- ANS: if auth fails inside our context, and we do have a refreshtoken, hit the refresh endpoint, verify that the JWTUSERID = userID stored with the refreshToken



## Create server flow
- User is shown several pre-approved containers
- User selects a container to launch
- This posts some information on the container to the backend
- Verify that the user CAN launch this server
- Verify that the server can be launched (memory avail and cpu avail)
- if both of these pass, launch the server
    * launching the server is genuinely a giant step in of itself
    * ASSUMING everything succeeds(safety checks), we should pull the container



## Dashboard flow
- GET SERVER TYPES
- GET MY SERVERS

## Admin dashboard flow
- GET SERVER TYPES
- GET ALL ACTIVE SERVERS



## Useful links for me
https://docs.docker.com/reference/api/engine/version/v1.52/#tag/Container/operation/ContainerInspect