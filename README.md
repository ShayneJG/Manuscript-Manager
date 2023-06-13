# Manuscript-Manager

This is a complete re-write of a project that me (Shayne Geilman) and Emma Moore wrote some time ago. Our original app functions more or less as desired, but we learnt as we went, and the end result was very unreadable and unmaintainable. We have learnt so much since then, and it seemed only natural for us to come back at this and implement all the new things we've learnt, while also adding new features!

The current plan is Typescript, Chakra UI, Next.js, and Node/Express.js and Mongoose/MongoDB for the backend.

We are also aiming to implement some kind of authentication, and will likely use Auth0, even though its probably overkill, just for the practice.

As of 13/06/2023: 

Auth0 was abandoned as it was too complex for our needs. Inititally, we intended to use auth0 as authentication and authorization, allowing the payrate to be set as user metadata. After about a week, we could not implement it, and felt that it wasn't worth continuing. We chose to use next-auth, which was easy to setup, and then used our own user collection in MongoDB to handle user-based data. 
