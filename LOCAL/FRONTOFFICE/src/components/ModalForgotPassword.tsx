import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext"
import Loader from "./Loader"
import api from "../services/apiClient"


const ModalForgotPassword = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{

  const [email,setEmail] = useState("")
  const [isLoading,setIsLoading] = useState(false)   
  const toast = useToast()
  const {token} = useAuth()

  const handleSendTextLesson = ()=>{
    setIsLoading(true)

    api.post("forgotPassword",{
      email,
    },{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res=>{
      toast({
        title: 'Email sent',
        description: "check your e-mail to change your password",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)

      onClose()

    
      
    }).catch(()=>{
      toast({
        title: 'Customer not found',
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
        <ModalHeader>To change your password tell us your e-mail</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
         <FormControl>
            <FormLabel>email</FormLabel>
            <Input 
            type="email"
            onChange={(e)=>{
              setEmail(e.target.value)
            }} placeholder='email' />
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

  export default ModalForgotPassword