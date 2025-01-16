import 'next-auth'
import { DefaultSession } from 'next-auth'
//define new data types or modify  existing data types 

declare module 'next-auth'{
    //redefining the existing module 
    //declare is a file, 

        //modify the User interface in the next-auth module-
    interface User { 
        _id?:string //used in the options.ts callbacks--> user_id
        isVerified?:boolean
        isAcceptingMessages?:boolean
        username?:string
    }
    interface Session{
        user:{
            _id?:string
            isVerified?:boolean
            isAcceptingMessages?:boolean
            username?:string
        } & DefaultSession['user'] //key 'user' chahiye default session mei, whether wo value usme empty ho ya na ho.
    }

}

//another way to modify the interface in a module-

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string
        isVerified?:boolean
        isAcceptingMessages?:boolean
        username?:string  

    }
}