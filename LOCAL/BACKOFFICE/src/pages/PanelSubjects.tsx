import { Box, Button, ButtonGroup, 
  Center, Flex, FormControl, FormLabel, Heading, Icon, Input,Text,
 useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast, List, ListItem, Avatar, VStack, InputRightElement, InputRightAddon, InputGroup, Checkbox, useBreakpointValue } from "@chakra-ui/react";
import { FaTrash} from "react-icons/fa";


import SidebarWithHeader from "../components/SideBar";

import Loader from '../components/Loader';
import { useEffect, useState } from "react";

import { useAuth } from "../hooks/AuthContext";
import api from "../services/apiClient";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import VerifyPrompt from "../components/VerifyPrompt";

interface ISubject {
  id:number;
  name:string;

}

// modal to create subject
const ModalCreateSubject = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{
    

  const [name,setName] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()    
  const toast = useToast()
  const {token} = useAuth()

  const handleSendSubject = ()=>{
    setIsLoading(true)

    api.post("subject",{
      name
    },{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res=>{
      toast({
        title: 'Subject successfully published',
        description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)

      onClose()

      navigate("/Subject/"+ res.data.id)
      
      
    }).catch(()=>{
      toast({
        title: 'Could not publish Subject',
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
        <ModalHeader>New Subject</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
        <FormControl>
            <FormLabel>Name</FormLabel>
            <Input onChange={(e)=>{
              setName(e.target.value)
            }} placeholder='Name' />
          </FormControl>         
          
        </ModalBody>

        <ModalFooter>
          <Button onClick={()=>{handleSendSubject()}} colorScheme='pink' mr={3}>
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


export default function PanelSUbjects() {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const  [searchParams, setSearchParams] = useSearchParams()

  const [maxPage, setMaxPage] = useState(0)

  const {token} = useAuth()

  const width100whenMobile = useBreakpointValue({
    sm:"100%",
    md:"",
    lg:"",
    base:"100%"
  })

  const MtWhenMobile = useBreakpointValue({
    sm:"4",
    md:"",
    lg:"",
    base:"4"
  })

  const [subjects,setSubjects] = useState<ISubject[]>()

  const [isLoading,setIsLoading] = useState(false)

  const [isDeletingEnable,setIsDeletingEnable] = useState(false)
  const verifyPrompt = useDisclosure()

  const toast = useToast()


  // method to make sure page always start at 1
  useEffect(()=>{ 

    let search = String(searchParams.get("search"))
    
    if(typeof(search) == typeof("")){
      setSearchParams({
          page: "1",
          
          search
       })
  }
  else{
      
       setSearchParams({
          page: "1"
       })
  }
  },[])

  const onHandleDeleteSubject=(subjectId:number)=>{

    setIsLoading(true)

    api.delete(`subject/${subjectId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newSubjects = subjects?.filter(
        txtL=>(txtL.id != subjectId)
      )

      toast({
        title: 'Subject deleted permanenlty',
        description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setSubjects(newSubjects)

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Subject ',
          description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)
    })
  }

  // method to make sure page always start at 1
  useEffect(()=>{

    let search = String(searchParams.get("search"))
    
    if(typeof(search) == typeof("")){
      setSearchParams({
          page: "1",
          
          search
       })
  }
  else{
      
       setSearchParams({
          page: "1"
       })
  }
  },[])

  useEffect(()=>{
       
    setIsLoading(true) 
    
    let search:string = `subject/list?page=${searchParams.get("page") || 1}&search=${ searchParams.get("search") || "" }`
 
  
    api.get(search,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
        setSubjects(res?.data?.subjects)
        setMaxPage(res?.data?.count)
        setIsLoading(false)
    }).catch(err=>{
        console.log(err);
        setIsLoading(false)
    })
},[searchParams])
  
  const handleClickNext = ()=>{

    let page = Number(searchParams.get("page"))
    let search = String(searchParams.get("search"))
  
    
    if(page >= maxPage)
      {
        toast({
          title: 'Can not go to next page',
          description: "it is the last page",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })

        return
      }

    if(typeof(search) == typeof("")){
        setSearchParams({
            page: (page + 1 ).toString(),
            
            search
         })
    }
    else{
        
         setSearchParams({
            page: (page + 1 ).toString()
         })
    }
}

const handleClickPrevious = ()=>{

    let page = Number(searchParams.get("page"))
    let search = String(searchParams.get("search"))

    if(page - 1 <= 0){
      toast({
        title: 'Can not go to previous page',
        description: "it is the first page",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      return
    }

    if(typeof(search) == typeof("")){
        setSearchParams({
            page: (page - 1 > 1 ? page - 1 : 1 ).toString(),
           search
         })
    }
    else{
        
         setSearchParams({
            page: (page - 1 > 1 ? page - 1 : 1 ).toString(),
          
         })
    }

  }

  return (
    <>
    <SidebarWithHeader>
      <Loader isLoading={isLoading}/>

      <VerifyPrompt onClose={verifyPrompt.onClose} onOpen={verifyPrompt.onOpen} isOpen={verifyPrompt.isOpen} >
            <Button color={"red.400"} onClick={verifyPrompt.onClose} >Ok</Button>          
        </VerifyPrompt>

      <ModalCreateSubject isOpen={isOpen} onClose={onClose} />

      <Center mt="10" textAlign={"center"} >
        <Heading mr="4" >Subjects</Heading>
        
      </Center>

      <VStack maxW="3xl" margin={"0 auto"}>
      <Flex flexWrap={"wrap"} w="100%" justifyContent={"space-between"}  >
        <Button w={width100whenMobile} onClick={onOpen} colorScheme="pink" >Create a Subject</Button>
        
        <Box w={width100whenMobile} mt={MtWhenMobile}>
        <InputGroup w="100%">
        <Input onChangeCapture={(e)=>{

        let page = Number(searchParams.get("page"))
        setSearchParams({page: (page - 1 >= 1 ? page - 1 : 1).toString(),search:e.currentTarget.value })

        }} type="text"  />

          <InputRightElement width='4.5rem'>
              <InputRightAddon w="100%" h="100%"  >
                  <FiSearch/>
              </InputRightAddon>
          </InputRightElement>

        </InputGroup>
        <Checkbox mt="4" onChange={(e)=>{
              setIsDeletingEnable(e.target.checked)

              if(e.target.checked){
                verifyPrompt.onOpen()
              }

            }}>
              Enable Delete
          </Checkbox>
        </Box>
        
        
      </Flex>
      <List   w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
                       
              {
                subjects?.map(subject=>(
                  <ListItem key={subject.id} flexWrap={"wrap"} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                       
                       <Flex w="100%" alignItems={"center"} flexWrap={"wrap"} justifyContent={"space-between"}>
                        <Link  style={{width:width100whenMobile,height:"100%"}} to={`/subject/${subject.id}`}>       
                         <Text pl="4" fontSize={"large"}>{subject.name}  </Text> 
                         </Link>  
                         <Button mt={MtWhenMobile} onClick={()=>{
                            onHandleDeleteSubject(subject.id)
                          }} display={"flex"} p="4" alignItems={"center"} disabled={!isDeletingEnable} size="lg" justifyContent={"space-between"} bg="red.400">
                            
                            Delete 
                            
                            <Icon ml="2"><FaTrash></FaTrash></Icon>
                          </Button>
                       </Flex>
                            
                 </ListItem>
                ))
              }
                {subjects?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no subjects</Text>}
                 
                   
          </List>

          <Flex w="100%" justifyContent={"space-between"}>
            <Button colorScheme="pink"  onClick={handleClickPrevious} size={"lg"}>
                    <FiArrowLeft/> Previous
                </Button>

                <Button colorScheme="pink" onClick={handleClickNext} size={"lg"}>
                    Next <FiArrowRight/>
                </Button>
            </Flex>
      </VStack>
    </SidebarWithHeader>
    </>
  );
}