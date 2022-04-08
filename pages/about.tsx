import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'

const Home = () => {
  


  return (
      <div>
        <section style={{minHeight:"100vh"}} className="flex items-center h-full sm:p-16 bg-gray-900 text-coolGray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">                
                <p className="text-3xl text-white">Made by Adetifa Bolu</p>
            </div>
        </section>
      </div>
  )
}

export default dynamic(() => Promise.resolve(Home), {ssr: false})