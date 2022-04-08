import dynamic from "next/dynamic";
import { useRouter } from "next/router";

function Custom404() {
    const router = useRouter()
    return(
        <section style={{minHeight:"100vh"}} className="flex items-center h-full sm:p-16 bg-gray-900 text-coolGray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
                
                <p className="text-3xl text-white"><span style={{color:"red"}}>This</span > page could not be found. This is the way 👈🏾</p>
            </div>
        </section>
    )
  }

  
export default dynamic(() => Promise.resolve(Custom404), { ssr: false });