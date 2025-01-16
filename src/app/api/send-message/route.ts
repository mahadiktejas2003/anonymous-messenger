import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

// route for Sending message by user

export async function POST(request:Request){
    await dbConnect()
    const {username, content}= await request.json()

    try{    

        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User Not found"
            },{status: 404})
        }

        //is user accepting the messages 
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
        },{status:403})
        }
        const  newMessage={content, createdAt : new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
            
        return Response.json({
            success: true,
            message: "Messages sent succesfully"
        },{status:201})
    }
    catch(error){
        console.log("Error adding the messages",error);
        return Response.json({
            success: false,
            message: "Internal Server error"
    },{status:500})

    }

}

//it's catch block means hume message push nahi hua/ mila.


//try blcok is entering message into User
//so in catch block->  error adding messages-so status=500

