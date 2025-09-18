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
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function UserDashboard() {
  // All hooks must be called at the top level
  const { toast } = useToast();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { register, watch, setValue } = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  });
  const acceptMessages = watch('acceptMessages');
  const [profileUrl, setProfileUrl] = useState<string>("");

  // API calls
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      console.log('Success--ACCEPT MESSAGE RESPONSE is:', response);
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      console.log('THE DASHBOARD-- Error ACCEPT MESSAGE RESPONSE');
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch Message Settings',
        variant: 'destructive'
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages'
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const username = session?.user as User;
  useEffect(() => {
    if (username && typeof window !== 'undefined') {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username.username}`);
    }
  }, [username]);

  function handleDeleteMessage(messageId: string) {
    console.log("delete start from UI");
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  function copyToClipboard() {
    if (profileUrl && typeof window !== 'undefined') {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'URL Copied',
        description: 'Profile URL has been copied to clipboard.',
      });
    }
  }

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      console.log('HANDLE SWITCH- acceot message', response);
      console.log("THE RESPOSNE ACCEPT MESSAGE UPDATED- ", !acceptMessages);
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Faled to update the message settings',
        variant: 'destructive'
      });
    }
  };

  // Conditional return must be after all hooks
  if (!session || !session.user) {
    return <div></div>;
  }

  // Main dashboard JSX
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
      </div>
      <div className="mb-4">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
        />
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={copyToClipboard}
      >
        Copy Profile URL
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id ? String(message._id) : String(index)}
              message={message}
              onMessageDelete={() => handleDeleteMessage(String(message._id))}
            />
          ))
        ) : (
          <div>No messages found.</div>
        )}
      </div>
    </div>
  );
}
