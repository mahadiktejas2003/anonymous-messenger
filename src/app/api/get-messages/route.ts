import mongoose from 'mongoose';
import { auth, handlers } from "../auth/[...nextAuth]/options";
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

// We've to get all the messages.
// Firstly check whether user is logged in or not.

export async function GET(request: Request) {
  await dbConnect();
  const session = await auth();

  const user: User = session?.user as User;
  console.log('current SESSION USER: ', user, '_____');

  // If there's no session, or no user inside session, then user is not logged in
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Not authenticated',
      }),
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const userModified = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } }, // Descending order sort
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ])

    console.log(user);

    if (!userModified || userModified.length === 0) {
      
      console.log('NO MODIFFIED MESSAGE')
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messages: userModified[0].messages,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.log('An unexpected error occurred', err);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred',
      }),
      { status: 500 }
    );
  }
}