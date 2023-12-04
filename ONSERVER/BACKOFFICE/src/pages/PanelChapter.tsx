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
import { BsTrash } from "react-icons/bs";

interface IChapter{
  id:number;
  title:string;
}

interface ILesson{
  id:number;
  title:string;
  description:string;
}

const ModalCreateLesson = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{

  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const {id} = useParams()

  const [isDeletingEnableLessonn,setIsDeletingEnableLessonn] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()    
  const toast = useToast()
  const {token} = useAuth()

  const handleSendLesson = ()=>{
    setIsLoading(true)

    api.post("lesson",{
      title:name,
      description,
      chapterId:id
    },{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res=>{
      toast({
        title: 'Lesson successfully published',
        description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)

      onClose()

      navigate("/Lesson/" + res.data.id)
      
      
    }).catch(()=>{
      toast({
        title: 'Could not publish Lesson',
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
        <ModalHeader>New Lesson</ModalHeader>
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
          <Button onClick={()=>{handleSendLesson()}} colorScheme='pink' mr={3}>
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default function PanelChapter() {
  
  const {token} = useAuth()
  const [isLoading,setIsLoading] = useState(false)
  const {id} = useParams()
  const [Chapter,setChapter] = useState<IChapter>()
  const toast = useToast()

  const [Lessons, setLessons] = useState<ILesson[]>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const  [searchParams, setSearchParams] = useSearchParams()

  const [maxPage, setMaxPage] = useState(0)

  const [ChapterTitle,setChapterTitle] = useState("")

  const [isDeletingEnable,setIsDeletingEnable] = useState(false)

  const verifyPrompt = useDisclosure()

  // method to update Chapter
  const onHandleUpdateChapter = (e:any)=>{
    e.preventDefault()
    setIsLoading(true)
    api.put(`chapter/${id}`,{
      title:ChapterTitle,
      
    },{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setChapter(res.data)
     
      setIsLoading(false)

      toast({
            title: 'Chapter successfully updated',
            description: "",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
      }).catch(err=>{
          toast({
            title: 'Could not update Chapter',
            description: "",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })

          setIsLoading(false)
      })

  }

  // method to load Chapter info
  useEffect(()=>{

    setIsLoading(true)
    api.get(`Chapter/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setChapter(res.data)
     
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


  const onHandleDeleteLesson=(lessonId:number)=>{

    setIsLoading(true)

    api.delete(`lesson/${lessonId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newTextLessons = Lessons?.filter(
        txtL=>(txtL.id != lessonId)
      )

      toast({
        title: 'Lesson deleted permanenlty',
          description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setLessons(newTextLessons)

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Lesson ',
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
    api.get(`lesson/list/${id}?page=${searchParams.get("page") || 1}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setLessons(res?.data?.lessons);
      console.log(res.data);
      
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
          <ModalCreateLesson isOpen={isOpen} onClose={onClose} />
          <Loader isLoading={isLoading}/>
          <VerifyPrompt onClose={verifyPrompt.onClose} onOpen={verifyPrompt.onOpen} isOpen={verifyPrompt.isOpen} >
            <Button color={"red.400"} onClick={verifyPrompt.onClose} >Ok</Button>          
          </VerifyPrompt>
          <Container maxW="3xl" >
          <Stack w="100%" margin={"0 auto"} spacing={4}>
              <Heading textAlign={"center"} w="100%">
                Chapter Info
              </Heading>
                <form onSubmit={onHandleUpdateChapter}>
                  <FormLabel>
                    Name:
                  </FormLabel>
                <FormControl>
                <Input onChange={e=> setChapterTitle(e.target.value)} p="4" py="8" bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} defaultValue={Chapter?.title} ></Input>
                
                 </FormControl> 
 
                 <ButtonGroup display='flex' justifyContent='flex-end'>
                
                 <Button onClick={onHandleUpdateChapter} colorScheme='pink'>
                   Save
                 </Button>
                 </ButtonGroup>
                </form>
               
          </Stack>
        <Heading textAlign={"center"} w="100%">
          Lessons
        </Heading>
        <Flex w="100%" justifyContent={"space-between"}  >
        <Button onClick={onOpen} colorScheme="pink" >Create a Lesson</Button>
        
        <Checkbox onChange={(e)=>{
              setIsDeletingEnable(e.target.checked)

              if(e.target.checked){
                verifyPrompt.onOpen()
              }

            }}>
              Enable Delete
            </Checkbox>
        
        </Flex>
           <List mt="4"  w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
                 
                 {
                   Lessons?.map(Lesson=>(
                     <ListItem key={Lesson.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                       
                       <Flex w="100%" alignItems={"center"} justifyContent={"space-between"}>
                        <Link style={{width:"100%",height:"100%"}} to={`/Lesson/${Lesson.id}`}>       
                         <Text pl="4" fontSize={"large"}>{Lesson.title}  </Text> 
                         </Link>  
                         <Button onClick={()=>{
                            onHandleDeleteLesson(Lesson.id)
                          }} display={"flex"} p="4" alignItems={"center"} disabled={!isDeletingEnable} size="lg" justifyContent={"space-between"} bg="red.400">
                            
                            Delete 
                            
                            <Icon ml="2"><FaTrash></FaTrash></Icon>
                          </Button>
                       </Flex>
                            
                 </ListItem>
                   ))
                 }
                 
                 {Lessons?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no Lessons</Text>}
                 
                     
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