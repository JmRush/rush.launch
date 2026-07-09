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

## Create server flow

- User is shown several pre-approved containers
- User selects a container to launch
- This posts some information on the container to the backend ("some information was doing the heavy lifting here...")
- Verify that the user CAN launch this server
- Verify that the server can be launched (memory avail and cpu avail), this should be interesting
- if both of these pass, launch the server
  - launching the server is genuinely a giant step in of itself
  - ASSUMING everything succeeds(safety checks), we should pull the container

- API baseURL config
  - AuthContext,
  - global_util,
  - dashboard fetches - lib/api.ts -> fallback to localhost if ...

## Create a container/server

- Check if allowed, and server type exists inside out db
- Pull image, if this works, yippie step 1 is done;

- Create image, this requires a lot of information and limits
  - ports, port assignment, port usage is different for every game server
  - volume mounting and determining the amount of space/if a volume is required
  -

## Later work

- Refactor queries and db to use relations instead of joins
- Refactor backend code to utilize zod in all incoming data points
