import { Center, Flex, Grid, GridItem,Textarea,Text, Heading, Icon,Image, SimpleGrid, useColorModeValue, Stack, Input, ButtonGroup, Button, IconButton, Box, useBreakpointValue, FormControl, useTab, useToast, useDisclosure, List, ListItem, Container, InputGroup, InputRightElement, InputRightAddon, ModalOverlay, ModalContent, FormLabel, ModalBody, ModalHeader, ModalCloseButton, ModalFooter, Modal, Checkbox } from "@chakra-ui/react";
import { FaBook, FaImage, FaPlay, FaTrash, FaUser } from "react-icons/fa";
import SidebarWithHeader from "../components/SideBar";
import CardModule from "../components/CardModule";
import { useEffect, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import VerifyPrompt from "../components/VerifyPrompt";

interface ISubject{
  id:number;
  name:string;
}

interface ICourse{
  id:number;
  name:string;
  imgUrl:string

}

const ModalCreateCourse = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{

  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const {id} = useParams()
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()    
  const toast = useToast()
  const {token} = useAuth()

  const handleSendCourse = ()=>{
    setIsLoading(true)

    api.post("course",{
      name,
      description,
      subjectId:id
    },{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res=>{
      toast({
        title: 'Course successfully published',
        description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)

      onClose()

      navigate("/Course/" + res.data.id)
      
      
    }).catch(()=>{
      toast({
        title: 'Could not publish Course',
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
        <ModalHeader>New Course</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
         <FormControl>
            <FormLabel>Name</FormLabel>
            <Input onChange={(e)=>{
              setName(e.target.value)
            }} placeholder='Name' />
          </FormControl>  

          <FormControl mt="2">
            <FormLabel>Description</FormLabel>
            <Textarea onChange={(e)=>{
              setDescription(e.target.value)
            }} placeholder='Description' />
          </FormControl>       
          
        </ModalBody>

        <ModalFooter>
          <Button onClick={()=>{handleSendCourse()}} colorScheme='pink' mr={3}>
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default function PanelSubject() {
  
  const {token} = useAuth()
  const [isLoading,setIsLoading] = useState(false)
  const {id} = useParams()
  const [subject,setSubject] = useState<ICourse>()
  const toast = useToast()

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

  const [courses, setCourses] = useState<ICourse[]>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const  [searchParams, setSearchParams] = useSearchParams()

  const [maxPage, setMaxPage] = useState(0)

  const [isDeletingEnable,setIsDeletingEnable] = useState(false)
  const verifyPrompt = useDisclosure()

  const [subjectName,setSubjectName] = useState("")

  // method to update subject
  const onHandleUpdateSubject = (e:any)=>{
    e.preventDefault()
    setIsLoading(true)
    api.put(`subject/${id}`,{
      name:subjectName
    },{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setSubject(res.data)
     
      setIsLoading(false)

      toast({
            title: 'Subject successfully updated',
            description: "",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
      }).catch(err=>{
          toast({
            title: 'Could not update subject',
            description: "",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })

          setIsLoading(false)
      })

  }

  // method to load subject info
  useEffect(()=>{

    setIsLoading(true)
    api.get(`subject/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setSubject(res.data)
     
      setIsLoading(false)
  }).catch(err=>{
  
      setIsLoading(false)
  })

  },[])

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

  const onHandleDeleteCourse=(courseId:number)=>{

    setIsLoading(true)

    api.delete(`course/${courseId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newTextCourses = courses?.filter(
        txtL=>(txtL.id != courseId)
      )

      toast({
        title: 'Course deleted permanenlty',
        description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setCourses(newTextCourses)

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Course ',
          description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)
    })
  }


  // method to update page when params change
  useEffect(()=>{

    setIsLoading(true)
    api.get(`course/list?subjectId=${id}&page=${searchParams.get("page") || 1}&search=${ searchParams.get("search") || "" }`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setCourses(res?.data?.courses);
      console.log(res.data.courses);
      
      setMaxPage(res?.data?.count)
     
      setIsLoading(false)
  }).catch(err=>{
  
      setIsLoading(false)
  })

  },[searchParams])

  const handleClickNext = ()=>{

    let page = Number(searchParams.get("page"))
    let search = String(searchParams.get("search"))
    
   

    if(page  >= maxPage)
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
          <ModalCreateCourse isOpen={isOpen} onClose={onClose} />
          <Loader isLoading={isLoading}/>
              
          <VerifyPrompt onClose={verifyPrompt.onClose} onOpen={verifyPrompt.onOpen} isOpen={verifyPrompt.isOpen} >
            <Button color={"red.400"} onClick={verifyPrompt.onClose} >Ok</Button>          
          </VerifyPrompt>
          
          <Container maxW="3xl" >
          <Stack w="100%" margin={"0 auto"} spacing={4}>
                <Heading textAlign={"center"} w="100%">
                Subject Info
              </Heading>
                <form onSubmit={onHandleUpdateSubject}>
                  <FormLabel>
                    Name:
                  </FormLabel>
                <FormControl>
                <Input onChange={e=> setSubjectName(e.target.value)} p="4" py="8" bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} defaultValue={subject?.name} ></Input>
                
                 </FormControl> 
 
                 <ButtonGroup display='flex' justifyContent='flex-end'>
                
                 <Button onClick={onHandleUpdateSubject} colorScheme='pink'>
                   Save
                 </Button>
                 </ButtonGroup>
                </form>
               
          </Stack>
        <Heading textAlign={"center"} w="100%">
          Courses
        </Heading>
        <Flex w="100%" flexWrap={"wrap"}  justifyContent={"space-between"}  >
        <Button w={width100whenMobile} onClick={onOpen} colorScheme="pink" >Create a Course</Button>
        
        <Box mt={MtWhenMobile} w={width100whenMobile} >
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
           <List mt="4"  w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
                 
                 {

                   courses?.map(course=>(
                    <ListItem w="100%" flexWrap={"wrap"} key={course.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                    <Flex w="100%" flexWrap={"wrap"}  alignItems={"center"} justifyContent={"space-between"}>
                      <Link style={{width:width100whenMobile,height:"100%"}} to={`/course/${course.id}`}>       
                      <Flex alignItems={"center"}>
                      <Box maxW="20">
                              <Image w="100%" h="100%" objectFit={"contain"} src={course.imgUrl} ></Image>
                      </Box>
                      <Text pl="4" fontSize={"large"}>{course.name}  </Text> 
                      </Flex>
                      </Link>  
                      <Button mt={MtWhenMobile} onClick={()=>{
                          onHandleDeleteCourse(course.id)
                        }} display={"flex"} p="4" alignItems={"center"} disabled={!isDeletingEnable} size="lg" justifyContent={"space-between"} bg="red.400">
                          
                          Delete 
                          
                          <Icon ml="2"><FaTrash></FaTrash></Icon>
                        </Button>
                    </Flex>       
                    </ListItem>
                   ))
                 }
                 
                 {courses?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no courses</Text>}
                 
                     
             </List>
   
             <Flex w="100%" justifyContent={"space-between"}>
               <Button colorScheme="pink"  onClick={handleClickPrevious} size={"lg"}>
                       <FiArrowLeft/> Previous
                   </Button>
   
                   <Button colorScheme="pink" onClick={handleClickNext} size={"lg"}>
                       Next <FiArrowRight/>
                   </Button>
               </Flex>
          </Container>
           
    </SidebarWithHeader>
    </>
  );
}