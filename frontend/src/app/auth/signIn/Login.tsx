
"use client"
import google from '../../../assets/google.png'
import apple from '../../../assets/apple.png';
import Image from 'next/image';
import Card from '../../../components/ui/Card';
import Link from 'next/link';
import H1 from '../../../components/ui/H1';
import Button from '../../../components/ui/Button';
import { redirect } from 'next/navigation';
import { useState } from 'react';


export default function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  function signIn() {
    console.log(email);
    console.log(password);
    redirect('/dashboard');

  }
  return (
    <>

      {/* Card */}
      <Card>
        {/* Heading */}
        <H1>
          Login to your account
        </H1>

        {/* Input */}
        <div className="mt-6 w-full">
          <input
            type="text"
            name="emailId"
            id="emailId"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Please enter email id."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
          />
        </div>
        <div className="mt-6 w-full">
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Please enter password."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
          />
        </div>

        <div className='mt-6 w-full'>
          <div className='flex justify-between'>
            <div className='flex'>
              <input type='radio' name='remember' id='remember' />
              <label className='px-2' id='remember'>Remember me</label>
            </div>
            <Link href='/auth/resetpassword' className='text-blue-400 underline justify-end'>Forget password.</Link>
          </div>

        </div>

        {/* Optional: Button */}
        <div className="mt-6 w-full">
          <Button onClickBtn={signIn}>
            Sign In
          </Button>
        </div>
        <div className='mt-6 w-full flex justify-center'>
          <div>or login with</div>
        </div>
        <div className='mt-6 w-full flex flex-col md:flex-row gap-2'>
          <div className="border-2 border-gray-100 rounded-2xl py-2 sm:px-12 md:px-16 cursor-pointer">
            <div className='flex items-center gap-2 px-2'>
              <Image src={google} alt='google-logo' className='w-4 h-4' loading='eager' />
              <h1>Google</h1>
            </div>

          </div>
          <div className="border-2 border-gray-100 rounded-2xl py-2 sm:px-12 md:px-16 cursor-pointer">
            <div className='flex items-center gap-2'>
              <Image src={apple} alt='apple-logo' className='w-8 h-4' loading='eager' />
              <h1>Apple</h1>
            </div>

          </div>


        </div>
        <div className='mt-6 w-full flex justify-center'>
          <div className='flex gap-2'>
            <button className='text-gray-500 font-bold font-[outfit] cursor-pointer'>{`Don't have an account?`}</button>
            <Link href={"/auth/signUp"} className='text-orange-500 font-bold cursor-pointer'>Get Started</Link>
          </div>

        </div>
      </Card>

    </>
  );
}