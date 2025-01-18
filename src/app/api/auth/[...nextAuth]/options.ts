import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials'
import dbConnect from '@/lib/dbConnect'
import bcrypt from 'bcryptjs'
import UserModel from '@/model/User'

import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

export const { auth, handlers, signIn, signOut   }= NextAuth({
    providers:[
        Credentials({
            id:'credentials',
            name:'Credentials',
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{

                //authorize the id password with the database.

                //connect with database-
                await dbConnect()

                try{

                    //find User- we can find by Username Or by Email
                    //for futureproof- > do using Or of mongoose -get the user
                    const user= await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })


                    //if we have not receieved the User- then throw Error:
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    //if User is Not Verified- >Custom credential hai humara ye
                    if(!user.isVerified){
                        throw new Error('Please verify your account before login')
                  
                    }

                    //if we've found user->then  check his password
                    const isPasswordCorrect= await bcrypt.compare(credentials.password, user.password);
                     //check this isPasswordCorrect boolean
                    if(isPasswordCorrect) return user //return the User
                    else throw new Error('Incorrect Password') 

                }
                catch(err:any){
                    throw new Error(err) //this is to raise the Error on sign in/ login


                }

            }
        })

    ],
    callbacks:{
        async jwt({token,user}){
            //making the token powerful.take out data from user and inject into token.
            if(user){
                token._id = user._id?.toString()
                token.isVerified= user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username= user.username
            }
            return token
        },
        async session({session,token}){

            //modify the session
            if(token){
                session.user._id=token._id
                session.user.isVerified= token.isVerified
                session.user.isAcceptingMessages= token.isAcceptingMessages
                session.user.username= token.username
            }
            return session
        }
    },  
    session:{
        strategy:'jwt'//
    },
    secret:process.env.NEXTAUTH_SECRET,   
    pages:{
        //to overwrite the sign in page- write it below , otherwise the default is always- signIn:'auth/singin' [see docs]
        signIn:'/sign-in'
    },
})