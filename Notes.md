# MVP - Rush launch

## Current backend requirements

- Get all active servers
- Make or include a proper logging system
- Update the error handling system to not over-write thrown errors (nested throws with new throws at the end)
- Site wide rate limiting, More aggressive one for logins, server creations
- Admin page endpoints - container inspection
- Admin page endpoints - container lifecycle
- Admin page endpoints - container modification
- Admin page endpoints - Docker compose (custom container creations via admin endpoint)

## Refactors

- Refactor queries and db to use relations instead of joins
- Refactor backend code to utilize zod in all incoming data points
