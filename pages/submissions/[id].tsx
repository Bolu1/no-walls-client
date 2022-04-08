import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { GetServerSideProps } from 'next'

import FileBase from "react-file-base64";
import dynamic from "next/dynamic";

export default function SubmitAssignment(props){
  const {id} = props
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(3);
  const [submissons, setSubmissons] = useState([]);
  const [image, setImage] = useState("")
  const [token, setToken] = useState("");
  const [info, setInfo] = useState("");
  const [description, setDescription] = useState("");


  var userInfo
 if(Cookies.get('user')){
    const data = JSON.parse(Cookies.get('user'))
    // const n = data.email.split("@")
    userInfo = data
 }

 useEffect(() =>{
    setLoading(true)
       if (!Cookies.get("user")) {
          router.push("/");
        }
      const requestBody1 = {
        query :`
        query{
          getSubmission(id: "${id}"){
            post
            media
            createdAt
            user{
              name
              profile
            }
          }
        }
        `
      }


    const get = async(): Promise<void> =>{
      const response1 = await axios.post(' https://no-walls.herokuapp.com//graphql', JSON.stringify(requestBody1),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })

      setSubmissons(response1.data.data.getSubmission) 
      setLoading(false)
    }
    get()
  },[setSubmissons])

  const moreSubmissonsHandler = async():Promise<void> =>{
    setLoading(true)
    const requestBody3 = {
      query :`
      query{
        getSubmission(id: "${id}", page:${page}){
          post
        }
      }
      `
    }
    const response1 = await axios.post(' https://no-walls.herokuapp.com//graphql', JSON.stringify(requestBody3),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
      setPage(page+1)
      setSubmissons(response1.data.data.posts) 
      setLoading(false)


  }


  const type = (base:any) =>{

    if(base == null){
      return false
    }
    const first = base.split("/")
    const second = first[0].split(":")
    return second[1]
  }
 

  return (
    <div className="bg-gray-900 text-coolGray-100">
      <Layout title="New Class">

      <div style={{minHeight:"90vh"}} className="bg-gray-900">
      {!submissons ?
      <div className="flex justify-center pt-60">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>
     :
     <div>
    <div className="max-w-5xl  mx-auto text-center overflow-hidden  rounded-lg shadow-md  bg-gray-800">
      </div>

      <div  className="max-w-3xl space-y-4 mx-5 md:mx-auto overflow-hidden   ">
      
      {submissons && submissons.map(p =>(
      <div key={p.posts} className="  p-6 my-4 margin-bg-white space-x-4 rounded-md  bg-gray-800  text-white">
        <div className="flex  items-center  margin-bg-white space-x-4">
        <div className="flex items-center self-stretch justify-center">
        <div className="relative flex-shrink-0 px-2">
                        <img src={p.user.profile} alt="" className="w-12 h-12  rounded-full  bg-coolGray-500  border-coolGray-700"/>
                      </div>
        </div>
        <span className="text-white text-lg" >{p.user.name}</span>
        <span className="text-gray-300 " >{JSON.parse(p.createdAt)}</span>
        <br/>
      </div>
        <p className="py-2 px-16">{p.post}</p>
        {type(p.media) == "image" &&
        <div>
          <img className="object-cover w-full h-64 p-5" src={p.media} alt="File"/>
          <a  download="File" href={p.media} title="" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 ml-14 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          </a>
          </div>
        }
        {/* if not equl to image */}
        {type(p.media) != "image" && p.media &&
        <div className="flex">
          <a className="flex hover:text-blue-600 hover:underline" download="File" href={p.media} title="" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 ml-14 mr-2 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download this file
          </a>
          </div>
        }
      </div>
      ))}
      </div>
      {!loading && submissons[0] &&
      <div className="flex justify-center py-12">
      <div className="inline-flex items-center mx-auto rounded  bg-gray-800  text-white ">
        <button type="button" onClick={moreSubmissonsHandler} className="px-4 py-3">More posts</button>
        <button type="button" title="Toggle dropdown" className="p-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      </div> }
      {loading &&
      <div className="flex justify-center py-12">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>}
    </div>
    
    }
      </div>

        <br />
      </Layout>
    </div>
  );
};

export const getServerSideProps:GetServerSideProps = async (context) =>{

    const {query} = context
    return{
        props:query
    }
}