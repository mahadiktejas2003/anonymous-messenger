'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { signUpSchema } from "@/schemas/signUpSchema"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { useEffect } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const Page = () => {

    const {toast} = useToast()
    const router= useRouter()
    //Zod implementation

    const form= useForm<z.infer<typeof signInSchema> >({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:''
        }
    })
    //sign-in implementsthe NextAuth - > so write like this:
      const onSubmit = async (data: z.infer<typeof signInSchema>) => {
         
        const result= await signIn('credentials',{
          redirect:false,
          identifier:data.identifier,
          password: data.password          
        }) 
        //if result has optionally error, then-
        if(result?.error){
          toast({
            title:"Login failed",
            description:"Incorrect username or password",
            variant:"destructive"
          })
        }
        if(result?.url){
          router.replace('/dashboard')
        }
        
        
        
      }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4">Sign in to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                        <Input placeholder="email/username" {...field} //any one of email or username is credential
                          /> 
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField  
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              Signin
            </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>Not a member?{' '}
                <Link href='sign-up' className='text-blue-600 hover:text-blue-800'>Sign up</Link>
            </p>

          </div>
        </div>
      </div>
      
          
  )
}

export default Page;

