import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import{z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";
//we've imported the schema we created for validation with zod.
//now FOR VALIDATION- create a Query Schema
//Query schema- means to check this object/  this  variable- then it has syntax and we check that syntax

const UsernameQuerySchema=z.object({
    username:usernameValidation //parameter is username, username should follow the usernameValidation
})

//write a GET method- if someone sends username, then check it and tell if it exists or not.
//this is for the quickly checking the username avaialable or not on typing of username on frontend


export async function GET(request:Request){

    console.log('Recieve Request with Method: ',request.method)

    await dbConnect()

    try{
       const {searchParams}= new URL(request.url)
       const queryParam={
        username:searchParams.get('username')
       }

       //now validate the username query param with ZOD
       const result=  UsernameQuerySchema.safeParse(queryParam)

        // console.log(result)//TODO:remove
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || []

            return Response.json(
                {
                    success:false,
                    message:usernameErrors?.length>0
                    ?usernameErrors.join(', ')
                    :'Invalid Query parameters' 
                },
                {status: 400}
            ) 
        }

        //if success in result- then get the username
         const {username} = result.data
         
         const existinVerifiedUser= await UserModel.findOne({username,isVerified:true})

         if(existinVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:200})
         }
         return Response.json({
                success:true,
                message:"Username is unique"//i.e. username not taken yet
            },{status:200}
        )


    }
    catch(error){
        console.error('Errror checking username',  error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})

    }

}