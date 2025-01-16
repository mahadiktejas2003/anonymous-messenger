import React from 'react'
import dayjs from 'dayjs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'
import { Message } from '@/model/User'

type MessageCardProps= {
    message: Message,
    onMessageDelete: (messageId:string) => void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const {toast}= useToast()
    const handleDeleteConfirm=async()=>{
        const response=await axios.delete<ApiResponse>(`api/delete-message/${message._id}`)
        toast({
            title:response.data.message
        })
        onMessageDelete(message._id as string)
    }


    return (
    <Card>
  <CardHeader><div className="flex justify-between items-center">
    <CardTitle>{message.content}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick= {handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  <div>
  <p>
    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
    {'  on'}  {/* Adds space */} 
    {' '}  {/* Adds space */}
    {new Date(message.createdAt).toLocaleDateString()}
  </p>
</div>
</CardHeader>
<CardContent></CardContent>
</Card>

  )
}

export default MessageCard