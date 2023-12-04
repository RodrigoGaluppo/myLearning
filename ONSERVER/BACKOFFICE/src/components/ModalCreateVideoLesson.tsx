import { Button, FormControl,useColorModeValue, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext"
import Loader from "./Loader"
import api from "../services/apiClient"

const ModalCreateVideoLesson = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{

  const [name,setName] = useState("")
  const inputVideoRef = useRef<HTMLInputElement>(null)
  const {id} = useParams()
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()    
  const toast = useToast()
  const {token} = useAuth()

  const handleSendVideoLesson = ()=>{
    setIsLoading(true)

    if(!inputVideoRef.current?.files || inputVideoRef.current?.files?.length == 0){

      toast({
        title: 'Please select a file to update',
        description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      return
    }

    // first craete videolesson object
    api.post("videoLesson",{
      title:name,
      url:"",
      lessonId:id
    },{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res=>{
      
      const {id} = res.data
      
      const formData:FormData = new FormData()

      if(!inputVideoRef.current?.files || inputVideoRef.current?.files?.length == 0){

        toast({
          title: 'Please select a file to update',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
  
        return
      }

      formData.append("video", inputVideoRef.current.files[0])

      // then add video to it
      api.put("videoLesson/video/"+id,formData,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(()=>[
        window.location.reload()
      ])
      .catch(()=>{
        toast({
          title: 'Could not publish Lesson Text',
          description: "try again later",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        setIsLoading(false)
      })
      
    }).catch(()=>{
      toast({
        title: 'Could not publish Lesson Text',
        description: "try again later",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)
    })

  }

  return(
    <Modal  
      isOpen={isOpen}
      onClose={onClose}
    >
      <Loader isLoading={isLoading} />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Lesson Video</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
         <FormControl>
            <FormLabel>Name</FormLabel>
            <Input onChange={(e)=>{
              setName(e.target.value)
            }} placeholder='Name' />
          </FormControl>  

          <FormControl mt="2">
            <FormLabel>content</FormLabel>
            
            <FormLabel>
                Video:
              </FormLabel>
            <FormControl>
                
                <Input
                  mt="2"
                  type="file"
                  h="100%"
                  accept="image/"
                  ref={inputVideoRef} p="4" py="8" 
                  bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} 
                  />

                </FormControl>

          </FormControl>       
          
        </ModalBody>

        <ModalFooter>
          <Button onClick={()=>{handleSendVideoLesson()}} colorScheme='pink' mr={3}>
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
  export default ModalCreateVideoLesson