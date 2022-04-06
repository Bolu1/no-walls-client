import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  const [data, setData] = useState([])
  var userInfo
  
  if(Cookies.get('user') == undefined){
    router.push("/")
  }else{
     const data = JSON.parse(Cookies.get('user'))
     // const n = data.email.split("@")
     userInfo = data
  }

  const requestBody = {
    query :`
    query{
      getClass{
        _id
        name
        profile
        info
        createdAt
        teacher{
          name
          profile
        }
      }
    }
    `
  }

  useEffect(() =>{
    setLoading(true)
    let response: any
    const get = async(): Promise<void> =>{
      const response = await axios.post('http://localhost:8000/graphql', JSON.stringify(requestBody),
      {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${userInfo.token}`,
        }
      })
      setData(response.data.data.getClass) 
      if(response.data.errors){
        setEmpty(true)
      }
      
    setLoading(false)
    }
    get()
  },[setData])


  const getDate = (stamp)=>{
    let unix_timestamp =  1549312452
    // let a = []
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      // const a =data.map(d =>{  
      var date = new Date(stamp * 1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      // console.log(formattedTime);
      return formattedTime
    // })
  }
  

  return (
    <Layout title="classes">
      <div style={{minHeight:"90vh"}} className="bg-gray-900 px-5">
        {empty && 

        <h2 className="text-4xl pt-60 font-bold text-center text-gray-700  text-white">
                   You do not have any classes yet 
                  </h2>
                  
                  }
      {loading ?
      <div className="flex justify-center pt-60">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-violet-400"></div>
        </div>
     :
     <div className="grid grid-cols-2 px-3 py-4 gap-y-10 sm:grid-cols-1 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {/* card */}
      { data && data.map((d)=>(
    <div key={d._id} onClick={() =>router.push(`/class/${d._id}`)} className="max-w-sm overflow-hidden cursor-pointer hover:shadow-2xl bg-white rounded-lg shadow-md  bg-gray-800">
        <img className="object-cover w-full h-40" src={d.profile} alt="Article"/>

        <div className="p-6">
            <div>
                <span className="text-xs font-medium text-blue-600 uppercase  text-blue-400">Class</span>
                <a  className="block mt-2 text-2xl font-semibold text-gray-800 transition-colors duration-200 transform  text-white ">{d.name}</a>
                <p className="mt-2 text-sm text-gray-600  text-gray-400">{d.info}</p>
            </div>

            <div className="mt-4">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <img className="object-cover h-10 rounded-full" src={d.teacher.profile} alt="Avatar"/>
                        <a href="#" className="mx-2 font-semibold text-gray-700  text-gray-200">{d.teacher.name}</a>
                    </div>
                    <span className="mx-1 text-xs text-gray-600  text-gray-300">{getDate(d.createdAt)}</span>
                </div>
            </div>
        </div>
    </div>
    ))}
    

      </div> }
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Home), {ssr: false})