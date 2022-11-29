import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import FileBase from "react-file-base64";
import dynamic from "next/dynamic";

const Newquestion = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [image, setImage] = useState("");
  const [token, setToken] = useState("");
  const [info, setInfo] = useState("");
  const [description, setDescription] = useState("");
  if (!Cookies.get("user")) {
    router.push("/");
  }
  var userInfo;
  if (Cookies.get("user")) {
    const data = JSON.parse(Cookies.get("user"));
    // const n = data.email.split("@")
    userInfo = data;
  }
  const submitHandler = async (e): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const requestBody = {
        query: `
      mutation{
          createClass(classInput: 
            {
              name: "${name}"
              password: "${password}"
              info: "${info}"
              profile: "${image}"
              teacher: "${userInfo.userId}"
              memebers: "${userInfo.userId}"
          }
            ){
              _id
              name
          }
      }
    `,
      };
      await axios.post(
        "  https://nowalls-server.onrender.com/graphql",
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setLoading(false);
      router.push("/home");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect((): void => {
    const data = JSON.parse(Cookies.get("user"));
  }, []);

  const setI = (i) => {
    //  console.log(i)
    const im = JSON.stringify(i.base64);
    setImage(i.base64);
  };

  return (
    <div className="bg-gray-900 text-coolGray-100">
      <Layout title="New Class">
        <section className="w-full max-w-2xl px-6 py-4 mx-auto rounded-md shadow-md bg-gray-800">
          <h2 className="text-3xl font-semibold text-center text-white">
            Create a new Class
          </h2>

          <form className="mt-6 " onSubmit={(e) => submitHandler(e)}>
            <div className="items-center -mx-2 md:flex">
              <div className="w-full mx-2 mt-4 md:mt-0">
                <label className="block mb-2 text-sm font-medium text-gray-600 text-gray-200">
                  Name
                </label>

                <input
                  onChange={(e) => setname(e.target.value)}
                  value={name}
                  className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  type="text"
                  required
                  placeholder="Name"
                />
              </div>
            </div>

            <div className="items-center mt-4 -mx-2 md:flex">
              <div className="w-full mx-2 mt-4 md:mt-0">
                <label className="block mb-2 text-sm font-medium text-gray-600 text-gray-200">
                  Password
                </label>

                <input
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                  className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  type="password"
                  required
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="items-center mt-4 -mx-2 md:flex">
              <div className="w-full mx-2 mt-4 md:mt-0">
                <label className="block mb-2 text-sm font-medium text-gray-600 text-gray-200">
                  Class Information
                </label>

                <input
                  onChange={(e) => setInfo(e.target.value)}
                  value={info}
                  className="block w-full px-4 py-2 mt-2  placeholder-gray-400 border border-gray-200 rounded-md  placeholder-gray-600  bg-gray-900  text-gray-300  border-gray-700 focus:border-blue-400  focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  type="text"
                  required
                  placeholder="Class Information"
                />
              </div>
            </div>

            <fieldset className="w-full space-y-1  pt-4 text-coolGray-100">
              <label className="block text-sm text-white font-medium">
                Upload Profile Photo
              </label>
              <div className="flex text-white px-8 py-12 border-2 border-dashed rounded-md border-coolGray-700 text-coolGray-400 bg-coolGray-800">
                {/* <input type="file" name="files" id="files" className="px-8 py-12 border-2 border-dashed rounded-md border-coolGray-700 text-coolGray-400 bg-coolGray-800"/> */}
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => setI({ base64 })}
                />
              </div>
            </fieldset>

            <div className="flex justify-center mt-6">
              {!loading ? (
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-blue-700"
                >
                  Submit
                </button>
              ) : (
                <div className="flex justify-center ">
                  <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
                </div>
              )}
            </div>
          </form>
        </section>
        <br />
      </Layout>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Newquestion), { ssr: false });
