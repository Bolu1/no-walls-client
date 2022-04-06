import type { NextPage } from "next";
import Layout from "../components/Layout";
import dynamic from "next/dynamic"
import Link from "next/link";
import Cookies from 'js-cookie'
import axios from 'axios'
import {useRouter} from 'next/router'
import { useEffect, useState } from "react";


const JoinClass: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [message, setMessage] = useState(null);

  
  var userInfo
  
  if(Cookies.get('user') == undefined){
    router.push("/")
  }else{
     const data = JSON.parse(Cookies.get('user'))
     // const n = data.email.split("@")
     userInfo = data
  }

    const requestBody = {
      query:`
        mutation{
          joinClass(id:"${id}", password:"${password}"){
            _id
          }
        }
      `
    }

    const submitHandler = async(e): Promise<any> =>{
      setLoading(true)
      
      try{
      e.preventDefault()
      const {data} =  await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody),{
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${userInfo.token}`,

      }
      })
      if(data.data.joinClass == null){
          console.log(data.data)
          setMessage("Something went wrong confirm the class details ")
      }else{
          router.push("/home")
      }
      setLoading(false)}
      catch(err){
        console.log(err)
        setLoading(false)
      }
    } 

  return (
  <Layout title="Join">
    <div className="bg-white dark:bg-gray-900">
          <div className="flex justify-center h-screen">
            

            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
              <div className="flex-1">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                    Join a class 
                  </h2>
                  {message == "Auth successsful" && (
                    <p className="mt-3 text-green-600 dark:text-green-600">
                      {message}
                    </p>
                  )}

                  {message && message != "Auth successsful" && (
                    <p className="mt-3 text-red-600 dark:text-red-600">
                      {message}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <form onSubmit={(e)=>submitHandler(e)}>
                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Class Id
                      </label>
                      <input
                        required
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        type="text"
                        id="name"
                        placeholder="Class Id"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400  border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-600 dark:text-gray-200">
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
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                    
                    <div className="mt-6">
                    {!loading?
                      <button
                        type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        Join
                      </button>:

                      <div className="flex justify-center ">
                      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
                      </div>
                        }
                    </div>
                  </form>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(JoinClass), {ssr: false})