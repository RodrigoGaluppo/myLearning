import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext"
import Loader from "./Loader"
import api from "../services/apiClient"

const ModalCreateResourceLesson = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{

    const [name,setName] = useState("")
    const [content,setContent] = useState("")
    const {id} = useParams()
    const [isLoading,setIsLoading] = useState(false)
    const navigate = useNavigate()    
    const toast = useToast()
    const {token} = useAuth()
  
    const handleSendTextLesson = ()=>{
      setIsLoading(true)
  
      api.post("resourceLesson",{
        title:name,
        link:content,
        lessonId:id
      },{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res=>{
        toast({
          title: 'Lesson resource successfully published',
          description: "",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        setIsLoading(false)
  
        onClose()
  
        window.location.reload()
        
      }).catch(()=>{
        toast({
          title: 'Could not publish lesson resource',
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
          <ModalHeader>New Lesson Resource</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
           <FormControl>
              <FormLabel>Name</FormLabel>
              <Input onChange={(e)=>{
                setName(e.target.value)
              }} placeholder='Name' />
            </FormControl>  
  
            <FormControl mt="2">
              <FormLabel>link</FormLabel>
              
              <Input onChange={(e)=>{
                setContent(e.target.value)
              }} placeholder='Link' />
  
            </FormControl>       
            
          </ModalBody>
  
          <ModalFooter>
            <Button onClick={()=>{handleSendTextLesson()}} colorScheme='pink' mr={3}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  export default ModalCreateResourceLesson