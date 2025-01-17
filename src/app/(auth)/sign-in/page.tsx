'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast, useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@radix-ui/react-separator'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Ensure the component name starts with an uppercase letter
export default function SignInForm() { // Corrected the component name to 'Page'
  //states
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()
  function handleDeleteMessage(messageId: string) {
    console.log("delete start from UI")
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  //form
  const { register, watch, setValue } = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const acceptMessages = watch('acceptMessages')

  //API calls

  //accceptMessage status fetching
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')

      console.log('Success--ACCEPT MESSAGE RESPONSE is:', response);

      setValue('acceptMessages', response.data.isAcceptingMessages) // setValue: Dynamically updates form values
    }
    catch (error) {
      console.log('THE DASHBOARD-- Error ACCEPT MESSAGE RESPONSE');

      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||
          'Failed to fetch Message Settings',
        variant: 'destructive'
      })
    }
    finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  //Purpose: Fetches all messages via an API call and updates the state.
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      })

    }
    finally {
      setIsLoading(false)
      setIsSwitchLoading(false) //TODO: try changing this
    }

  }, [setIsLoading, setMessages])

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages() //fetching the messages
    fetchAcceptMessage() //state if isAcceptingMessages

  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  // Handle switch change

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      console.log('HANDLE SWITCH- accept message', response);

      console.log("THE RESPONSE ACCEPT MESSAGE UPDATED- ", !acceptMessages)
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });

    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message || 'Failed to update the message settings',
        variant: 'destructive'
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const username = session?.user as User; //getting username
  console.log('username', username)
  //Setting up the URL for anonymous users to send messages

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username.username}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied',
      description: 'Profile URL has been copied to clipboard.',
    })
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
