import type { NextPage } from "next";
import Layout from "../components/Layout";
import dynamic from "next/dynamic"
import Link from "next/link";
import Cookies from 'js-cookie'
import axios from 'axios'
import {useRouter} from 'next/router'
import { useEffect, useState } from "react";


const Home: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [message, setMessage] = useState(null);
  

    const requestBody = {
      query:`
        query{
          login(email:"${email}", password:"${password}"){
            token
            email
            name
            userId
            profile
          }
        }
      `
    }

    const loginHandler = async(e): Promise<any> =>{
      setLoading(true)
      try{
      e.preventDefault()
      const {data} =  await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody),{
        headers: {
          'Content-Type': 'application/json'
      }
      })
      const user = data.data.login
      const store = {
        token: user.token,
        email: user.email,
        name: user.name,
        userId: user.userId
      }
      Cookies.set('user', JSON.stringify(store),  {expires: 30})
      localStorage.setItem("nowallsprofile", user.profile);
      router.push('/home')
      setLoading(false)}
      catch(err){
        console.log(err)
        setMessage("Invalid login parameters")
        setLoading(false)
      }
    } 

  return (
    <div className=" bg-gray-900">
          <div className="flex justify-center h-screen">
            

            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
              <div className="flex-1">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-center text-gray-700  text-white">
                    Login to use <span className="text-blue-400">No walls</span>
                  </h2>
                  {message == "Auth successsful" && (
                    <p className="mt-3 text-green-600  text-green-600">
                      {message}
                    </p>
                  )}

                  {message && message != "Auth successsful" && (
                    <p className="mt-3 text-red-600  text-red-600">
                      {message}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <form onSubmit={(e)=>loginHandler(e)}>
                    <div>
                      <label className="block mb-2 text-sm text-gray-600  text-gray-200">
                        Email
                      </label>
                      <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="name"
                        placeholder="Email"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400  border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-600  text-gray-200">
                          Password
                        </label>
                      </div>

                      <input
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Passsword"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900    border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                    
                    <div className="mt-6">
                    {!loading?
                      <button
                        type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        Signin
                      </button>:

                      <div className="flex justify-center ">
                      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
                      </div>
                        }
                      <p className="mt-6 text-sm text-center text-gray-400">
                       Do not have an account?{" "}
                    <a
                      onClick={() => router.push("/signup")}
                      className="text-blue-500 focus:outline-none focus:underline hover:underline cursor-pointer"
                    >
                      Sign up
                    </a>
                    .
                  </p>
                    </div>
                  </form>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default dynamic(() => Promise.resolve(Home), {ssr: false})