import { Center, Flex, Grid, GridItem,Textarea,Text, Heading, Icon,Image, SimpleGrid, useColorModeValue, Stack, Input, ButtonGroup, Button, IconButton, Box, useBreakpointValue, FormControl, useTab, useToast, useDisclosure, List, ListItem, Container, InputGroup, InputRightElement, InputRightAddon, ModalOverlay, ModalContent, FormLabel, ModalBody, ModalHeader, ModalCloseButton, ModalFooter, Modal, VStack, Checkbox, Switch } from "@chakra-ui/react";
import SidebarWithHeader from "../components/SideBar";
import { LegacyRef, useEffect, useRef, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import VerifyPrompt from "../components/VerifyPrompt";

interface IChapter{
  id:number;
  title:string
}

interface ICourse{
  id:number | undefined;
  name:string | undefined;
  imgUrl:string | undefined;
  description:string | undefined;
}

const ModalCreateChapter = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{

  const [title,setTitle] = useState("")
  const {id} = useParams()
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()    
  const toast = useToast()
  const {token} = useAuth()

  const handleSendCourse = ()=>{
    setIsLoading(true)

    api.post("chapter",{
      title,
      courseId:id
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

      navigate("/Chapter/" + res.data.id)
      
      
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
        <ModalHeader>New Chapter</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
         <FormControl>
            <FormLabel>Title</FormLabel>
            <Input onChange={(e)=>{
              setTitle(e.target.value)
            }} placeholder='Title' />
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
  const [course,setCourse] = useState<ICourse>()
  const toast = useToast()

  const [isDeletingEnable,setIsDeletingEnable] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const  [searchParams, setSearchParams] = useSearchParams()

  const [maxPage, setMaxPage] = useState(0)

  const inputFilesRef = useRef<HTMLInputElement>(null)

  const [Chapters,setChapters] = useState<IChapter[]>()

  const verifyPrompt = useDisclosure()

  const [isActive, setIsActive] = useState(false)
                

  // method to update courses image

  const onHandleUpdateCourseImage = (e:any)=>{
    e.preventDefault()

    if(!inputFilesRef.current?.files || inputFilesRef.current?.files?.length == 0){

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

    setIsLoading(true)

    let formData:FormData = new FormData()

    formData.append("img", inputFilesRef.current.files[0])

    api.put(`course/image/${id}`,formData,{ headers: {
      "Authorization" : `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }}).then((res)=>{
       
      setCourse(res.data)
  
      setIsLoading(false)

      toast({
            title: 'Course successfully updated',
            description: "",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
      }).catch(err=>{
          toast({
            title: 'Could not update course',
            description: "",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })

          setIsLoading(false)
      })

  }

  // method to update course
  const onHandleUpdateCourse = (e:any)=>{
    e.preventDefault()
    setIsLoading(true)
    api.put(`course/${id}`,{
     ...course
    },{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setCourse(res.data)
     
 
      setIsLoading(false)

      toast({
            title: 'Course successfully updated',
            description: "",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
      }).catch(err=>{
          toast({
            title: 'Could not update course',
            description: "",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })

          setIsLoading(false)
      })

  }

  const onHandleChnageActiveStatus= (e:React.ChangeEvent<HTMLInputElement>)=>{

    
    setIsLoading(true)
    api.put("course/active/"+id,{
        active:e.target.checked
    },{ 
        headers: {"Authorization" : `Bearer ${token}`}
    }).then((res)=>{
       
        setIsActive(res.data?.active)
        setCourse(res.data)
      
        toast({
            title: 'success',
            description: "customer was successfully updated",
            status: 'success',
            duration: 9000,
            isClosable: true, position:"top-left"
          })
         
        setIsLoading(false)
    }).catch(err=>{
        toast({
            title: 'error',
            description: "could not update customer info",
            status: 'error',
            duration: 9000,
            isClosable: true, position:"top-left"
          })
        setIsLoading(false)
    })
  }

  // method to load course info
  useEffect(()=>{

    setIsLoading(true)
    api.get(`course/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setCourse(res.data)
      setIsActive(res.data?.active)
      setIsLoading(false)
    

  }).catch(err=>{
  
    toast({
      title: 'Can not load course',
      description: "try again later",
      status: 'error',
      duration: 9000,
      isClosable: true,
      position:"top-left"
    })


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

  const onHandleDeleteChapter=(chapterId:number)=>{

    setIsLoading(true)

    api.delete(`chapter/${chapterId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newTextChapters = Chapters?.filter(
        txtL=>(txtL.id != chapterId)
      )

      toast({
        title: 'Chapter deleted permanenlty',
          description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setChapters(newTextChapters)

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Chapter ',
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
    // list chapters of course
    api.get(`chapter/list/${id}?page=${searchParams.get("page") || "1"}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      console.log(res.data);
      
      setChapters(res.data?.chapters)
      setMaxPage(res.data?.count)

      setIsLoading(false)

    }).catch(err=>{

      toast({
        title: 'Can not load chapters',
        description: "try again later",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

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
          <ModalCreateChapter isOpen={isOpen} onClose={onClose} />
          <Loader isLoading={isLoading}/>
          
          <VerifyPrompt onClose={verifyPrompt.onClose} onOpen={verifyPrompt.onOpen} isOpen={verifyPrompt.isOpen} >
            <Button color={"red.400"} onClick={verifyPrompt.onClose} >Ok</Button>          
          </VerifyPrompt>

          <Container maxW="3xl" >
          <Stack w="100%" margin={"0 auto"} spacing={4}>
              <Heading textAlign={"center"} w="100%">
                Course Info
              </Heading>

              <Flex >
                  <Text>active: </Text>
                  <Switch isChecked={isActive} onChange={e=>{
                      onHandleChnageActiveStatus(e)
                  }} colorScheme="pink" size={"md"} ml="2" />
                </Flex>

                <form onSubmit={onHandleUpdateCourseImage}>
                  <FormLabel>
                    Image:
                  </FormLabel>
                <FormControl>
                    
                    <Box margin={"0 auto"}  boxSize={"lg"}>
                      <Image fallbackSrc='https://via.placeholder.com/300'  h="100%" w="100%" objectFit={"contain"} src={course?.imgUrl} ></Image>
                      
                    </Box>
                    <Input
                      mt="2"
                      type="file"
                      h="100%"
                      accept="image/"
                      ref={inputFilesRef} p="4" py="8" 
                      bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} 
                      />

                    </FormControl>
                    <Button mt="2" onClick={onHandleUpdateCourseImage} colorScheme='pink'>
                    Save
                  </Button>
                </form>
                <form onSubmit={onHandleUpdateCourse}>
                
                  <VStack>
                  <FormLabel  w="100%" textAlign={"left"}>
                    Name:
                  </FormLabel>
                  <FormControl>
                    <Input onChange={e=> 

                    setCourse({
                            id:course?.id,
                            name:e.target.value,
                            description:course?.description,
                            imgUrl:course?.imgUrl
                          })

                    } p="4" py="8" bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} defaultValue={course?.name} />
                    
                    </FormControl> 
                    <FormLabel w="100%" textAlign={"left"}>
                    Description
                  </FormLabel>
                    <FormControl >
                    <Textarea onChange={e=> 
                      setCourse({
                        id:course?.id,
                        name:course?.name,
                        description:e.target.value,
                        imgUrl:course?.imgUrl
                      })
                    } p="4" py="8" bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} defaultValue={course?.description} />
                    
                    </FormControl> 
                  </VStack>
 
                 <ButtonGroup display='flex' justifyContent='flex-end'>
                
                 <Button mt="2" onClick={onHandleUpdateCourse} colorScheme='pink'>
                   Save
                 </Button>
                 </ButtonGroup>
                </form>
               
          </Stack>
        <Heading textAlign={"center"} w="100%">
          Chapters
        </Heading>
        <Flex w="100%" justifyContent={"space-between"}  >
        <Button onClick={onOpen} colorScheme="pink" >Create a Chapter</Button>
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
                   Chapters?.map(Chapter=>(
                     <ListItem key={Chapter.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                      <Flex w="100%" alignItems={"center"} justifyContent={"space-between"}>
                        <Link style={{width:"100%",height:"100%"}} to={`/Chapter/${Chapter.id}`}>       
                         <Text pl="4" fontSize={"large"}>{Chapter.title}  </Text> 
                         </Link>  
                         <Button onClick={()=>{
                            onHandleDeleteChapter(Chapter.id)
                          }} display={"flex"} p="4" alignItems={"center"} disabled={!isDeletingEnable} size="lg" justifyContent={"space-between"} bg="red.400">
                            
                            Delete 
                            
                            <Icon ml="2"><FaTrash></FaTrash></Icon>
                          </Button>
                       </Flex>       
                 </ListItem>
                   ))
                 }

                 {Chapters?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no Chapters</Text>}
                 
                     
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