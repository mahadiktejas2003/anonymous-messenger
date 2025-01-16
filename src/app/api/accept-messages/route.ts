
    import { auth } from '../auth/[...nextAuth]/options'
    import dbConnect from '@/lib/dbConnect'
    import UserModel from '@/model/User'
    import {User} from 'next-auth'

    //toggle to accept or not accept messages from currently logged in user

    export async function POST(request: Request){

        await dbConnect()
        const session = await auth()
        const user: User = session?.user as User;

        //if there's not session, or user inside session ,  then user is not logged in

        if(!session || !session.user){
            return Response.json({
                success:false,
                message:'Not authenticated' 
            },{status: 401})
        }

        const userId = user._id;
    //frontend will send the Toggle's flag- > accept or not flag
        const{acceptMessages}= await request.json()


        try{
            const updatedUser= await UserModel.findByIdAndUpdate(
                userId,
                {isAcceptingMessages: acceptMessages},
                {new :true}//due to this- it gives the updated value.
            )
            if(updatedUser) {  console.log("THE UPDATING USER IN FUNCTION!: user:  ",updatedUser.isAcceptingMessages);}

            if(!updatedUser){
                return Response.json({
                    success: false,
                    message: "failed to update the user status to accept the messages"
                },{status: 404})
            }
            return Response.json({
                success: true,
                message: "Message acceptance status updated successfully ",
                updatedUser
            },{status: 200})
        }
        catch(err){
            console.error('Error updating message acceptance status:', err);
            return Response.json(
                { success: false, message: 'Error updating message acceptance status' },
                { status: 500 }
              );

        }
    }

    //GET Request: to get the stataus by querieng the database

    export async function GET(request: Request){
        await dbConnect()
        const session = await auth()
        
        if(session?.user){
            
        const user: User = session.user;

        //if there's not session, or user inside session ,  then user is not logged in

        if(!session || !session.user){
            return Response.json({
                success:false,
                message:'Not authenticated' 
            },{status: 401})
        }

        const userId= user._id;


        try{
        const foundUser= await UserModel.findById(userId);
        //if user not found- 
        if(!foundUser){
            return Response.json({

                success:false,
                message:'User not found'
            },{status: 404})
        }
        //if user found- return response., send status
        return Response.json({

            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessages
        },{status: 200})
    }
    catch(err){
        console.log('Failed to update user status to accept messages')
        return Response.json(
            {
                success:false,
                message: 'Error in getting acceptance status'
            },
            {status:500}

        )

    }
    }
}