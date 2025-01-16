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

const page = () => {

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced= useDebounceCallback(setUsername, 300);
    const {toast} = useToast()
    const router= useRouter()
    //Zod implementation

    const form= useForm<z.infer<typeof signUpSchema> >({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })
    
    //hook for actual username checking after certain time intervals 
    useEffect(() => {
      const checkUsernameUnique = async () => {
        if (username) {
          console.log('Checking username:', username); // Log username being checked
          setIsCheckingUsername(true);
          setUsernameMessage(''); // Reset message
          try {
            const response = await axios.get<ApiResponse>(
              `/api/check-username-unique?username=${username}`
            );
            
            //in Axios→ check the response!!
            console.log('Response from axios:', response); // Log full response
            setUsernameMessage(response.data.message);
          } catch (error) {
            console.error('Error in Axios request:', error); // Log error details
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
              axiosError.response?.data.message ?? 'Error checking username'
            );
          } finally {
            setIsCheckingUsername(false);
          }
        }
      };
      checkUsernameUnique();
    }, [username]);
    

      const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
          const response = await axios.post<ApiResponse>('/api/sign-up', data);
    
          toast({
            title: 'Success',
            description: response.data.message,
          });
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        }
        catch(error){

                console.error("Error in signup of user",error)
                const axiosError= error as AxiosError<ApiResponse>;
                let errorMessage = axiosError.response?.data.message ?? 'Error signing up';
                toast({
                    title: 'Signup failed',
                    description: errorMessage,
                    variant: 'destructive'
                });
                setIsSubmitting(false);
        }
        
    }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                    
                        <Input placeholder='username'
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                debounced(e.target.value);//insert value into field
                            }}
                    /> 
                        {isCheckingUsername && <Loader2 className='animate-spin'/>}
                        <p className= {`text-sm ${usernameMessage==="Username is unique" ?'text-green-500': 'text-red-500'}`}>
                        {usernameMessage}
                        </p>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                        <Input placeholder="email" {...field} //inserts value automatically
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
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>Already a member?{' '}
                <Link href='sign-in' className='text-blue-600 hover:text-blue-800'>Sign in</Link>
            </p>

          </div>
        </div>
      </div>
      
          
  )
}

export default page;

