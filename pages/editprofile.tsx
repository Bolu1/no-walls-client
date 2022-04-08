import type { NextPage } from "next";
import Layout from "../components/Layout";
import dynamic from "next/dynamic"
import Link from "next/link";
import Cookies from 'js-cookie'
import axios from 'axios'
import FileBase from "react-file-base64";
import {useRouter} from 'next/router'
import { useEffect, useState } from "react";


const EditProfile: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const requestBody = {
      query:`
      mutation{
        editUser(
            name: "${name}"
            password: "${password}"
            newPassword: "${confirmPassword}"
            profile: "${image}"
          ){
            _id
            name
        }
    }
      `
    }

    
    useEffect(() => {
        if(Cookies.get('user')){
           const data = JSON.parse(Cookies.get('user'))
           setProfile(localStorage.getItem('nowallsprofile'))
           // const n = data.email.split("@")
           setName(data.name)
           setEmail(data.email)
           setToken(data.token)
        }
    },[])

    const submitHandler = async(e): Promise<any> =>{
      e.preventDefault()
      setLoading(true)
      try{
      if(confirmPassword && confirmPassword.length <6){
        setMessage("Password too short")
        setLoading(false)
        return
      }
      const {data} =  await axios.post(' https://no-walls.herokuapp.com//graphql', JSON.stringify(requestBody),{
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
      }
      })
      console.log(data)
      if(data.data.editUser == null){
        setMessage("Something went wrong")
        setLoading(false)
        return
      }
      Cookies.remove('user')
      router.push('/')
      setLoading(false)}
      catch(err){
        console.log(err)
        setMessage("Invalid login parameters")
        setLoading(false)
      }
    } 

    const setI = (i) =>{
      //  console.log(i)
      const im = JSON.stringify(i.base64)
      setImage(i.base64)
  }

  return (
    <Layout title="Edit Profile">
    <div style={{minHeight:"90vh"}} className="p-5 bg-gray-900">
    <section className="max-w-4xl p-6 mx-auto bg-gray-800 rounded-md shadow-md :bg-gray-800 ">
            <h2 className="text-lg font-semibold text-white capitalize :text-white">
              Account settings
            </h2>
            <div className="text-center"> 
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
            <form className="py-5 " onSubmit={(e)=>submitHandler(e)}>
              <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label
                    className="text-white :text-gray-200"
                    
                  >
                    Username
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    id="username"
                    type="text"
                    className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label
                    className="text-white :text-gray-200"
                    
                  >
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="emailAddress"
                    type="email"
                    readOnly
                    className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label
                    className="text-white :text-gray-200"
                    
                  >
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label
                    className="text-white :text-gray-200"
                   
                  >
                    New Password
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="passwordConfirmation"
                    type="password"
                    className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
              </div>

              <fieldset className="w-full space-y-1 pt-4  text-coolGray-100">
                <label  className="block text-sm text-white font-medium">
                  Upload Profile Photo(less than 1mb)
                </label>
                <div className="flex  px-8 py-12 border-2 text-white border-dashed rounded-md  border-coolGray-700  text-coolGray-400  bg-coolGray-800">
                  {/* <input type="file" name="files" id="files" className="px-8 py-12 border-2 border-dashed rounded-md  border-coolGray-700  text-coolGray-400  bg-coolGray-800"/> */}
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setI({ base64 })}
                  />
                </div>
              </fieldset>

              <div className="flex justify-center mt-6">
              {!loading?
                      <button
                      type="submit"
                      className="px-4 py-2 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-blue-700"
                    >
                      Submit
                    </button>:

                      <div className="flex justify-center ">
                      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
                      </div>
                        }
            </div>
            </form>
          </section>
    </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(EditProfile), {ssr: false})