import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import Cookies from 'js-cookie'
import FileBase from "react-file-base64";
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import { GetServerSideProps } from 'next'

export default function Home(props){
  const router = useRouter();
  const {id} = props
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [image, setImage] = useState("")
  const [share, setShare] = useState(false)
  const [page, setPage] = useState(2)
  const [posts, setPosts] = useState([])
  const [profile, setProfile] = useState("")
  const [data, setData] = useState({
    name: null,
    profile: null,
    info: null,
    createdAt: null,
    teacher: null
  })
  const [uprofile, setuProfile] = useState("")


  var userInfo
  
  if(Cookies.get('user') == undefined){
    // router.push("/")
  }else{
     const data = JSON.parse(Cookies.get('user'))
     // const n = data.email.split("@")
     userInfo = data
  }
 

  useEffect(() =>{
    setLoading(true)
    setuProfile(localStorage.getItem('nowallsprofile'))
    const requestBody = {
        query :`
        query{
          getOneClass(id: "${id}"){
            name
            profile
            info
            createdAt
            teacher{
              name
            }
          }
        }
        `
      }

      const requestBody1 = {
        query :`
        query{
          posts(id: "${id}"){
            post
            media
            user{
              name
              profile
            }
          }
        }
        `
      }

      
    const get = async(): Promise<void> =>{
      const response = await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
      const response1 = await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody1),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
      setPosts(response1.data.data.posts) 
      setData(response.data.data.getOneClass) 
      setProfile(response.data.data.getOneClass.profile)
    setLoading(false)
    }
    get()
  },[setData])

  const onPost = async() =>{
    // i did not need to give it another name, but oh well
    const requestBody2 = {
      query :`
      mutation{
        createPost(post: "${message}" media:"${image}" id:"${id}"){
          post
          user{
            name
          }
        }
      }
      `
    }
    
    if(message.trim().length < 1){
      return
    }
    const response = await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody2),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
    setShare(!share)
    router.reload();
  }

  const morePostHandler = async():Promise<void> =>{
    setLoading(true)
    const requestBody3 = {
      query :`
      query{
        posts(id: "${id}", page:${page}){
          post
          media
          user{
            name
          }
        }
      }
      `
    }
    const response1 = await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody3),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
      setPage(page+1)
      setPosts(response1.data.data.posts) 
      setLoading(false)


  }

  const setI = (i) =>{
    //  console.log(i)
    setImage(i.base64)
  }

  return (
    <Layout title="classes">
      <div style={{minHeight:"90vh"}} className="bg-gray-900">
      {!data ?
      <div className="flex justify-center pt-60">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
        </div>
     :
     <div>
    <div className="max-w-5xl  mx-auto text-center overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <img className="object-cover w-full h-64" src={profile} alt="Article"/>
        <div style={{position: "absolute", top: "33%", left: "50%", transform: "translate(-50%, -50%)"}} className="text-3xl font-semibold text-center text-gray-800 ">{data.name}</div>
        <div style={{position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)"}} className="text-xl font-semibold text-center text-gray-600 ">{data.info}</div>
    </div>
        <div  className="max-w-3xl my-4 mx-5 md:mx-auto text-center overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        {!share?
        <div className="flex items-center p-6  space-x-4 rounded-md dark:bg-gray-800 dark:text-white">
        <div className="flex items-center self-stretch justify-center">
          <div className="relative flex-shrink-0 px-2">
                        <img src={uprofile} alt="" className="w-12 h-12 border rounded-full dark:bg-coolGray-500 dark:border-coolGray-700"/>
                      </div>
        </div>
        <span className="text-gray-200  cursor-pointer hover:text-blue-600" onClick={()=>{setShare(!share)}}>Click here to post something to the class</span>
      </div>:

       <div className="flex items-center p-6 mx-5 md:mx-auto space-x-4 rounded-md dark:bg-gray-800 dark:text-white">
       <div className="w-full mt-4">
                <textarea
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                 className="block w-full h-40 px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"></textarea>
                <fieldset className="w-full mx-auto space-y-1 dark:text-coolGray-100">
                  
                  <div  style={{ marginLeft: "35%"}} className="flex mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  <div className="pt-2">
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setI({ base64 })}
                  />
                  </div>
                  </div>
                  
                </fieldset>
                <button className="px-4 py-2  font-medium tracking-wide text-white capitalize transition-colors duration-200 transform  rounded-md " onClick={()=>{setShare(!share)}}>
                    Cancel
                </button>
                <button onClick={()=>{onPost()}} className="px-4 py-2  font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                    Post
                </button>
            </div>
            
    
            
     </div>
      }
      </div>

      <div  className="max-w-3xl space-y-4 mx-5 md:mx-auto overflow-hidden   ">
      
      {posts && posts.map(p =>(
      <div key={p.posts} className="  p-6 my-4 margin-bg-white space-x-4 rounded-md dark:bg-gray-800 dark:text-white">
        <div className="flex  items-center  margin-bg-white space-x-4">
        <div className="flex items-center self-stretch justify-center">
        <div className="relative flex-shrink-0 px-2">
                        <img src={p.user.profile} alt="" className="w-12 h-12 border rounded-full dark:bg-coolGray-500 dark:border-coolGray-700"/>
                      </div>
        </div>
        <span className="text-white  cursor-pointer hover:text-blue-600" >{p.user.name}</span>
        <br/>
      </div>
        <p className="py-2 px-16">{p.post}</p>
        {p.media &&
          <img className="object-cover w-full h-64 p-5" src={p.media} alt="Article"/>
        }
      </div>
      ))}
      </div>
      {!loading && posts[0] &&
      <div className="flex justify-center py-12">
      <div className="inline-flex items-center mx-auto rounded dark:bg-gray-800 dark:text-white ">
        <button type="button" onClick={morePostHandler} className="px-4 py-3">More posts</button>
        <button type="button" title="Toggle dropdown" className="p-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      </div> }
      {loading &&
      <div className="flex justify-center py-12">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
        </div>}
    </div>
    
    }
      </div>
    </Layout>
  )
}

export const getServerSideProps:GetServerSideProps = async (context) =>{

    const {query} = context
    return{
        props:query
    }
}