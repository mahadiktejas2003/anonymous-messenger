import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/User';
import { NextRequest } from 'next/server';
import {auth } from '../../auth/[...nextAuth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const {messageid} = await params; //Await needed in params in dynamic routes-> Nextjs 15 update.
  await dbConnect();
  const session = await auth()
  const user: User = session?.user as User;
  if (!session || !user) {

    
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }
    
    
    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(-
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}