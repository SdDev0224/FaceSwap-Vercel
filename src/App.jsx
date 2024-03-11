import { useState } from "react"
import axios from 'axios'
import loading from './assets/images/loading.svg'
import logoImage from './assets/images/logo.webp'

const App = () => {
  const [faceSrc, setFaceSrc] = useState('')
  const [videoSrc, setVideoSrc] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [replacedVideoSrc, setReplacedVideoSrc] = useState('')

  //Function to handle file input change
  const handleFileInputChangeface = (e) => {
    const file = e.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        let src = reader.result
        if (src.split(':')[1].split('/')[0] !== 'image') return
        setFaceSrc(src)
      }
      reader.readAsDataURL(file)
    }
  }

  //Function to handle file input change
  const handleFileInputChangeVideo = async (e) => {
    const file = e.target.files[0]

    // if (file) setVideoSrc(URL.createObjectURL(e.target.files[0]));
    if (file) {
      setVideoSrc('')
      const reader = await new FileReader()
      reader.onloadend = () => {
        let src = reader.result
        if (src.split(':')[1].split('/')[0] !== 'video') return
        setVideoSrc(src)
      }
      reader.readAsDataURL(file)
    }
  }

  //Fuction to send API to backend to replace face in video
  const handleSubmit = async () => {
    try {
      const formData = new FormData()

      let image = document.getElementById(`inputImage`)
      let video = document.getElementById(`inputVideo`)

      if (!image.files.length || !video.files.length) return

      setLoading(true)
      setReplacedVideoSrc('')

      formData.append('image', image.files[0])
      formData.append('video', video.files[0])

      // let res = await axios.post('http://localhost:8000/api/replace-face/', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
      let res = await axios.post('https://narwhal-smooth-doe.ngrok-free.app/api/replace-face/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.status === !200) return

      let videoUrl = "data:video/mp4;base64," + res.data.video_path

      setReplacedVideoSrc(videoUrl)
      setLoading(false)

    } catch (err) {
      console.error('Error', err)
      setLoading(false)
    }
  }

  return (
    <div className="flex">
      <div className="absolute mt-5 ml-5">
        <img src={logoImage} alt="" />
      </div>
      <div className="flex flex-col items-center p-3 w-screen h-screen justify-center">
        <div className="text-white text-[2.7em] font-bold">Create Content with FaceSwap AI</div>
        <div className={replacedVideoSrc && videoSrc ? 'flex flex-row justify-arount mt-10 mb-16 w-full' : faceSrc || videoSrc ? "flex flex-row mt-10 mb-16 w-full" : "flex flex-row mt-20 mb-28 w-full"}>
          <div className="flex items-center w-full h-[100%]">
            <input id="inputImage" accept="image/jpeg, image/png" onChange={handleFileInputChangeface} className="hidden" type="file" />
            <div className={!faceSrc ? "w-[100%] h-full ml-[40%] mr-[5%]" : faceSrc && !replacedVideoSrc ? "outline outline-2 outline-offset-8 outline-white w-[100%] h-full ml-[45%] mr-[5%] bg-gray-500" : 'outline outline-2 outline-offset-8 outline-white w-[100%] h-full mx-[5%] bg-gray-500'}>
              {
                faceSrc
                  ? <div className="rounded-lg cursor-pointer" onClick={() => { document.getElementById('inputImage').click() }}><img src={faceSrc} alt="" className="w-[100%] h-[33vh]" /></div>
                  : <div className="bg-gray-900 rounded-lg cursor-pointer w-[100%] h-[100px] flex items-center justify-center" onClick={() => { document.getElementById('inputImage').click() }}><div className="text-white">Upload a face to replace</div></div>
              }
            </div>
          </div>
          <div className="flex items-center w-full h-[100%]">
            <input className="hidden" accept="video/mp4" onChange={handleFileInputChangeVideo} id="inputVideo" type="file" />
            <div className={!videoSrc ? "w-[100%] h-full mr-[40%] ml-[5%]" : videoSrc && !replacedVideoSrc ? "outline outline-2 outline-offset-8 outline-white w-[100%] h-full mr-[45%] ml-[5%] bg-gray-500" : 'outline outline-2 outline-offset-8 outline-white w-[100%] h-full mx-[5%] bg-gray-500'}>
              {
                videoSrc
                  ? <div className="rounded-lg cursor-pointer" onClick={() => { document.getElementById('inputVideo').click() }}><video className="w-[100%] h-[33vh]" controls><source className="" src={videoSrc} /></video></div>
                  : <div className="bg-gray-900 rounded-lg cursor-pointer w-[100%] h-[100px] flex items-center justify-center" onClick={() => { document.getElementById('inputVideo').click() }}><div className="text-white">Upload a video to replace</div></div>
              }
            </div>
          </div>
          {
            replacedVideoSrc &&
            <div className="flex items-center w-full h-[100%]">
              <div className="cursor-pointer bg-gray-500 outline outline-2 outline-offset-8 outline-white w-[100%] h-full mx-[5%]">
                <video controls style={{ 'width': '100%', 'height': '33vh' }}><source src={replacedVideoSrc} /></video>
              </div>
            </div>
          }
        </div>
        <button className="hover:bg-gray-950 text-[1.1em] hover:text-white w-20% bg-white py-3 px-8 rounded-lg" onClick={handleSubmit}>Submit</button>
      </div>
      {
        isLoading &&
        <div className="absolute t-0 w-full h-full">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={loading} alt="" />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
