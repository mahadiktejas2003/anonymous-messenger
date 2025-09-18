import mongoose, {Schema, Document} from 'mongoose'


export interface Message extends Document{
    
    content: string,
    createdAt: Date
}

//messages schema

const MessageSchema : Schema<Message>= new Schema(
    {
        content:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            required:true,
            default: () => new Date()
        }
    }
)


//User schema
//for every message- new document gets created->but we trying to keep it with User
//so there is message array-message[]

export interface User extends Document{
    username: string
    email:string
    password: string
    verifyCode:string
    verifyCodeExpiry:Date
    isVerified:boolean
    isAcceptingMessages:boolean
    messages: Message[]
}

//User schema- 
const UserSchema : Schema<User>= new Schema(
    {
        username:{
            type:String,
            required:[true,"Username is required"],
            trim: true, //if someone gave spaces while typign username-  then trim it with trim
            unique: true//username must be unqiue
        },
        email:{
            type:String,
            required:[true,"Username is required"],
            unique: true,
            match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'please use a valid email address']
        },
        password:{
            type:String,
            required: [true,"Password is required"],
        },
        verifyCode:{
            type:String,
            required: [true,"Verify Code is required"],
        },
        verifyCodeExpiry:{
            type:Date,
            required: [true,"Verify Code Expiry is required"],
        },
        isVerified:{
            type:Boolean,
            default: false
        },
        isAcceptingMessages: { 
            type:Boolean,
            default: true,
        },
        messages:[MessageSchema],
    }
)


const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema))

export default UserModel; //so User ka model ho gya define. and export kara.
