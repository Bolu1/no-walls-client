import type { NextPage } from "next";
import Image from "next/image";
import Layout from "../components/Layout";
import dynamic from "next/dynamic"
import Link from "next/link";
import Cookies from 'js-cookie'
import axios from 'axios'
import {useRouter} from 'next/router'
import { useEffect, useState } from "react";


const SignUp: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [name, setName] = useState("")

  useEffect(()=>{
      if(Cookies.get('userInfo')){
        router.push('/myapi')
      }
  },[])

  const registerHandler = async(e): Promise<any> =>{
      try{
      setLoading(true)
      e.preventDefault()
      if(password.trim().length < 6){
          setMessage("Password must be more than 6 characters")
          setLoading(false)
          return
      }
      if(password.trim() != cpassword.trim()){
          setMessage("Passwords do not match")
          setLoading(false)
          return
      }
      const requestBody = {
          query:`
            mutation{
                createUser(userInput: {email: "${email}", password:"${password}", name:"${name}"}){
                    _id
                    email
                }
            }
          `
      }
      
      const {data} = await  axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody),
      {
        headers: {
            'Content-Type': 'application/json'
        }
      }
      )
     
      console.log(data.data)
      if(data.data.createUser.email == undefined){
        setMessage("Email is already taken")
        setLoading(false)
        return
      }else{
        console.log("eetet")
      router.push('/')
      }
      setLoading(false)
    }catch(error){
          console.log(error)
          setLoading(false)
      }
  } 

  return (
    <div className=" bg-gray-900">
          <div className="flex justify-center h-screen">
            

            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
              <div className="flex-1">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-center text-white">
                   Create an account to use <span className="text-blue-400">No walls</span>
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
                  <form onSubmit={(e)=>registerHandler(e)}>
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
                        className="block w-full px-4 py-2 mt-2 placeholder-gray-400  border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-600  text-gray-200">
                          Name
                        </label>
                      </div>
                      

                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Name"
                        className="block w-full px-4 py-2 mt-2 text-white placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
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
                        className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-600  text-gray-200">
                          Confirm Password
                        </label>
                      </div>

                      <input
                        required
                        value={cpassword}
                        onChange={(e) => setCPassword(e.target.value)}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Confirm Password"
                        className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                    
                    <div className="mt-6">
                    {!loading?
                      <button
                        type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        Signup
                      </button>:

                      <div className="flex justify-center ">
                      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
                      </div>
                        }

                      <p className="mt-6 text-sm text-center text-gray-400">
                       Already have an account?{" "}
                    <a
                      onClick={() => router.push("/")}
                      className="text-blue-500 focus:outline-none focus:underline hover:underline cursor-pointer"
                    >
                      Sign in
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

export default dynamic(() => Promise.resolve(SignUp), {ssr: false})