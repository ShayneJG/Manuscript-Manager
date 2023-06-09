
import UserType from "@/types/user";
import { useSession } from "next-auth/react"



//returns user object that contains data from next-auth authentication + data from the mongoDB. 
function getUser() {
    const { data: session } = useSession();
    


    //TODO: Add proper pay rate. 
    const user: UserType = {
        name: session?.user?.name || "no name",
     image: session?.user?.image || "no image",
     email: session?.user?.email || "no email",
     payRate: 0.10
    }

    return user;
     
}








export default  getUser;