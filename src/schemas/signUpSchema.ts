
//when user signs up- checks to do- Username, email, password ..
//z.string means- is it a String?- that check

import { z } from "zod";

//for checking various things- username, emial. password- > so write in  Object{}

//with messages- > theý'll be shown 


export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/ , "Usernmae must not contain any Special Characters")

export const signUpSchema = z.object(
    {
        username: usernameValidation,
        email:z.string().email({message:'Invalid email address'}),
        password:z.string().min(6,'Password must be atleast 6 characters')
    }
)