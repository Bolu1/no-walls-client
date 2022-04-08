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
  const [state, setState] = useState(1)
  const [message, setMessage] = useState("")
  const [image, setImage] = useState("")
  const [share, setShare] = useState(false)
  const [page, setPage] = useState(3)
  const [posts, setPosts] = useState([])
  const [assignments, setAssignments] = useState([])
  const [profile, setProfile] = useState("")
  const [admin, setAdmin] = useState(false)
  const [due, setDue] = useState("")
  const [information, setInformation] = useState("")
  const [data, setData] = useState({
    _id: null,
    name: null,
    profile: null,
    info: null,
    createdAt: null,
    members: [],
    teacher: {name:null,
              profile: null}
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
  
  const arr = [1,2,3,4,5,6,7,8]

  useEffect(() =>{
    setLoading(true)
    setuProfile(localStorage.getItem('nowallsprofile'))
    const requestBody = {
        query :`
        query{
          getOneClass(id: "${id}"){
            _id
            name
            profile
            info
            createdAt
            members{
              name
              profile
            }
            teacher{
              _id
              name
              profile
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
            createdAt
            user{
              name
              profile
            }
          }
        }
        `
      }

      const requestBody2 = {
        query :`
        query{
          assignments(id: "${id}"){
              _id
              post
              dueDate
              createdAt
              media
            }
        }
        `
      }

    const get = async(): Promise<void> =>{
      const response = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
      const response1 = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody1),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
    const response2 = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody2),
    {
      headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${userInfo.token}`,
      }
    })
      setPosts(response1.data.data.posts) 
      setData(response.data.data.getOneClass) 
      setAssignments(response2.data.data.assignments)
      if(userInfo.userId == response.data.data.getOneClass.teacher._id){
        setAdmin(true)
      }
      setProfile(response.data.data.getOneClass.profile)
      setLoading(false)
    }
    get()
  },[setData, share])

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
    const response = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody2),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
    setShare(!share)
    // router.reload();
  }

  const morePostHandler = async():Promise<void> =>{
    setLoading(true)
    const requestBody3 = {
      query :`
      query{
        posts(id: "${id}", page:${page}){
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
    const response1 = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody3),
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

  const type = (base:any) =>{

    if(base == null){
      return false
    }
    const first = base.split("/")
    const second = first[0].split(":")
    return second[1]
  }

  const onAssignment = async():Promise<void> =>{
    try{
    setLoading(true)
    const requestBody3 = {
      query :`
      mutation{
        createAssignment(id: "${id}", dueDate:"${due}", post:"${information}", media:"${image}"){
          _id
          post
          }
        }
      `
    }

    const requestBody2 = {
      query :`
      mutation{
        createPost(post: "An assignment has been posted", id:"${id}"){
          post
          user{
            name
          }
        }
      }
      `
    }
    const response1 = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody3),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })

      const response2 = await axios.post('  https://no-walls.herokuapp.com/graphql', JSON.stringify(requestBody2),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })

      console.log(response1)
      router.reload();
      setLoading(false) }catch(error){
        console.log(error)
        setLoading(false)
      }
  }



  const setI = (i) =>{
    //  console.log(i)
    setImage(i.base64)
  }

  return (
    <Layout title="classes">

    
      <div className="flex bg-gray-900 mx-auto justify-center py-4">

        {state === 1 ?
          <button className="h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">
              Posts
          </button> :
            <button onClick={()=>setState(1)} className="h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
            Posts
           </button>
          }

        {state === 2 ?
          <button className="h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">
              People
          </button> :
            <button onClick={()=>setState(2)} className="h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
            People
           </button>
          }

        {state === 3 ?
          <button className="h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">
              Assignments
          </button> :
            <button onClick={()=>setState(3)} className="h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
            Asssignments
           </button>
          }
      </div>

      {/* first view */}

      { state === 1 &&
      <div style={{minHeight:"90vh"}} className="bg-gray-900">
      {!data ?
      <div className="flex justify-center pt-60">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>
     :
     <div>
    <div className="max-w-5xl  mx-auto text-center overflow-hidden  rounded-lg shadow-md  bg-gray-800">
        <img className="object-cover w-full h-64" src={profile} alt="Article"/>
        <div style={{position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)"}} className="text-3xl font-semibold text-center text-gray-800 ">{data.name}</div>
        <div style={{position: "absolute", top: "47%", left: "50%", transform: "translate(-50%, -50%)"}} className="text-xl font-semibold text-center text-gray-600 ">{data.info}</div>
        {admin && 
        <div style={{position: "absolute", top: "54%", left: "50%", transform: "translate(-50%, -50%)"}} className="text-xl font-semibold text-center text-gray-600 ">{data._id}</div>
        }
        </div>
        <div  className="max-w-3xl my-4 mx-5 md:mx-auto text-center overflow-hidden bg-white rounded-lg shadow-md  bg-gray-800">
        {!share?
        <div className="flex items-center p-6  space-x-4 rounded-md  bg-gray-800  text-white">
        <div className="flex items-center self-stretch justify-center">
          <div className="relative flex-shrink-0 px-2">
                        <img src={uprofile} alt="" className="w-12 h-12  rounded-full  bg-coolGray-500  border-coolGray-700"/>
                      </div>
        </div>
        <span className="text-gray-200  cursor-pointer hover:text-blue-600" onClick={()=>{setShare(!share)}}>Click here to post something to the class</span>
      </div>:

       <div className="flex items-center p-6  md:mx-auto space-x-4 rounded-md  bg-gray-800  text-white">
       <div className="w-full mt-4">
                <textarea
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                 className="block w-full h-40 px-4 py-2  border rounded-md  bg-gray-800  text-gray-300  border-gray-600 focus:border-blue-400  focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"></textarea>
                <fieldset className="w-full mx-auto space-y-1  text-coolGray-100">
                  
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
      {!loading && posts[0] &&
      <div className="flex justify-center py-12">
      <div className="inline-flex items-center mx-auto rounded  bg-gray-800  text-white ">
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
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>}
    </div>
    
    }
      </div> }



      {/* all members view */}
      { state === 2 &&
      
      <div style={{minHeight:"90vh"}} className="bg-gray-900">
      <section className="py-6 bg-coolGray-800 text-coolGray-100">
        <div className="container p-4 mx-auto space-y-16 sm:p-10">
        
        <div  className="space-y-4">
              <img alt="" className="object-cover h-56 mx-auto mb-4 bg-center rounded-sm bg-coolGray-500" src={data.teacher.profile}/>
              <div className="flex flex-col items-center">
                <h4 className="text-xl text-white font-semibold">{data.teacher.name}</h4>
                <p className="text-sm text-gray-400">Teacher</p>
              </div>
            </div>
            
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          { data.members.map(p =>(
            <div key={p} className="space-y-4">
              <img alt="" className="object-cover h-56 mx-auto mb-4 bg-center rounded-sm bg-coolGray-500" src={p.profile}/>
              <div className="flex flex-col items-center">
                <h4 className="text-xl text-white font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-400 text-coolGray-400">Student</p>
              </div>
            </div>
            ))}
            
          </div>
          </div>
      </section>
      </div>
      }


      {/* third view */}

      { state === 3 &&
      <div style={{minHeight:"90vh"}} className="bg-gray-900">
      {!data ?
      <div className="flex justify-center pt-60">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>
     :
     <div>
        <div  className="max-w-3xl  mx-5 md:mx-auto text-center overflow-hidden rounded-lg shadow-md  bg-gray-800">
        {admin &&
       <div className="flex items-center p-6 mx-5 md:mx-auto space-x-4 rounded-md  bg-gray-800  text-white">
       <div className="w-full mt-4">
              <p className="mb-4 text-lg">Post an assignment</p>
                
              <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-200  text-gray-200">
                          Due date
                        </label>
                      </div>
      
                      <input
                        required
                        value={due}
                        onChange={(e) => setDue(e.target.value)}
                        type="text"
                        name="due date"
                        id="due date"
                        placeholder="Due date e.g 23 mar"
                        className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-800 border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                <br/>
                <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-200  text-gray-200">
                          Information
                        </label>
                      </div>
                <textarea
                value={information}
                onChange={(e)=>setInformation(e.target.value)}
                 className="block w-full h-40 px-4 py-2 border rounded-md  bg-gray-800  text-gray-300  border-gray-600 focus:border-blue-400  focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"></textarea>
                <fieldset className="w-full mx-auto space-y-1  text-coolGray-100">
                  
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
                <button onClick={onAssignment} className="px-4 py-2  font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                    Post
                </button>
            </div>
            
    
            
     </div>
      }
      </div>

      <div  className="max-w-3xl space-y-4 mx-5 md:mx-auto overflow-hidden   ">
      
      {assignments && assignments.map(p =>(
      <div key={p.posts} className="  p-6 my-4 margin-bg-white space-x-4 rounded-md  bg-gray-800  text-white">
        <div className="flex  items-center  margin-bg-white space-x-4">
        <div className="flex items-center self-stretch justify-center">
        
        </div>
        <h1 className="text-white " ><span className='text-gray-300'>Assignment: </span>{p.post}</h1>
        <h1 className="text-white " ><span className='text-gray-300'>Due Date: </span>{p.dueDate}</h1>
        <br/>
      </div>
        {type(p.media) == "image" &&
        <div>
          <img className="object-cover w-full h-64 p-5" src={p.media} alt="File"/>
          <a  download="File" href={p.media} title="" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6  w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          </a>
          </div>
        }
        {/* if not equl to image */}
        {type(p.media) != "image" && p.media &&
        <div className="flex">
          <a className="flex hover:text-blue-600 my-3 hover:underline" download="File" href={p.media} title="" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6  mr-2 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download this file
          </a>
          </div>
        }

          {admin == false ?
          <button onClick={()=>router.push(`/assignment/${p._id}`)} className="px-2 mt-4 py-1  font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              Submit
          </button> :
          
          <button onClick={()=>router.push(`/submissions/${p._id}`)} className="px-2 mt-4 py-1  font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              Submissions
          </button>
          }

      </div>
      ))}
      </div>
      {!loading && posts[0] &&
      <div className="flex justify-center py-12">
      <div className="inline-flex items-center mx-auto rounded  bg-gray-800  text-white ">
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
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>}
    </div>
    
    }
      </div> }

    </Layout>

  )
}

export const getServerSideProps:GetServerSideProps = async (context) =>{

    const {query} = context
    return{
        props:query
    }
}