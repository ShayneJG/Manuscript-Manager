# Manuscript-Manager

This is a complete re-write of a project that Shayne Geilman and Emma Moore wrote some time ago. Our original app functions more or less as desired, but we learnt as we went, and the end result was very unreadable and unmaintainable. We have learnt so much since then, and it seemed only natural for us to come back at this and implement all the new things we've learnt, while also adding new features!

The current plan is Typescript, Chakra UI, Next.js, and Node/Express.js and Mongoose/MongoDB for the backend.

Authentication is handled by next-auth, and user data is managed by a mongoDB collection (at the moment, this is just payrate/email). 





# Major Issues (and how they were solved/avoided)

## Auth0

Auth0 worked fine for authentication, but we intended to use the user metadata to store the payrate for a given user. It proved too complicated, and the documentation was vague; most tutorials rehash the same thing the auth0 tutorial shows, and its really only regarding how to setup basic authentication. It proved way too complex for our use case and we spent about 2 weeks trying to get it to work but we weren't making any progress. 

### solution

We changed gears and used next-auth for authentication, which is simple, and then implemented our own MongoDB collection for userdata. This user data is accessed by comparing email (github requires a unique email) from session data to the database. If there isn't a document for that user, that users data is generated using the session data + default payrate. Payrate can be updated on the profile page. While it would be way easier/cleaner if we had managed to get the userdata of auth0 to work, this approach was simpler and easier to implement. 

## Merge conflict nightmare

We had an issue where Shayne was working on form validation, while Emma was working on a redesign for the main page. This caused significant overlap and led to a set of merge conflicts. We attempted to resolve these conflicts, but githubs interface proved very confusing, which resulted in many failed merges. This then led to a series of reverted merges, which then led to a very very confusing git history...

### solution

We reverted main to a state before the merges, and Shayne re-branched form validation to include the redesign, which avoided merge conflicts. 

We'll communicate more effectively and identify situations where our work overlaps; when it does overlap, we'll make sure to update/merge/rebase before we encounter difficult merges like this in the future. 
