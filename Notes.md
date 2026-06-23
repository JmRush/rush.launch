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
- This posts some information on the container to the backend
- Verify that the user CAN launch this server
- Verify that the server can be launched (memory avail and cpu avail)
- if both of these pass, launch the server
  - launching the server is genuinely a giant step in of itself
  - ASSUMING everything succeeds(safety checks), we should pull the container

## Useful links for me

<https://docs.docker.com/reference/api/engine/version/v1.52/#tag/Container/operation/ContainerInspect>

## Current issues

### Auth

- RBA is not setup yet (admin route protection backend) - RBA failure is 403 (forbidden) -> I think I did this? - VERIFY this is correct
- Verify complete

### Config updates

- API baseURL config
  - AuthContext,
  - global_util,
  - dashboard fetches - lib/api.ts -> fallback to localhost if ...

### Error handling

- Server error handling - throw error vs respond directly - decide - Done
- fallback in middeware_errors - done

### Create container endpoint

### Create container logic -> Docker engine API to spawn, get stats etc
