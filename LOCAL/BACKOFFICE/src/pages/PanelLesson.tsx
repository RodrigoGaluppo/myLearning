import { Flex, Text, Heading, useColorModeValue, Stack, Input, ButtonGroup, Button, 
  Box,
  FormControl, 
  useToast, useDisclosure, List, ListItem, Container,
  FormLabel, PopoverTrigger, PopoverArrow, Popover, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, Textarea, Checkbox } from "@chakra-ui/react";

import SidebarWithHeader from "../components/SideBar";
import { useEffect, useRef, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { BsEye, BsTrash } from "react-icons/bs";
import ModalCreateResourceLesson from "../components/ModalCreateResourceLesson";
import ModalCreateTextLesson from "../components/ModalCreateTextLesson";
import ModalCreateVideoLesson from "../components/ModalCreateVideoLesson";
import VerifyPrompt from "../components/VerifyPrompt";

interface ILesson {
  id: string | undefined;
  title: string | undefined;
  description:string | undefined;
  resourceLessons:IResourceLesson[] | undefined;
  textLessons:ITextLesson[] | undefined;
  videolessons:IVideoLesson[] | undefined;
  
}

interface IResourceLesson{
  id:number
  title:string
  link:string
}

interface IVideoLesson{
  id:number
  title:string
  url:string
}

interface ITextLesson{
  id:number
  title:string
  content:string
}


export default function PanelLesson() {
  
  const {token} = useAuth()
  const [isLoading,setIsLoading] = useState(false)
  const {id} = useParams()
  const [Lesson,setLesson] = useState<ILesson>()
  const toast = useToast()

  const [isDeletingEnableTextLesson,setIsDeletingEnableTextLesson] = useState(false)
  const [isDeletingEnableResourceLesson,setIsDeletingEnableResourceLesson] = useState(false)
  const [isDeletingEnableVideoLesson,setIsDeletingEnableVideoLesson] = useState(false)

  const modalCreateTextLesson = useDisclosure()
  const modalCreateVideoLesson = useDisclosure()
  const modalCreateResourceLesson = useDisclosure()
  const verifyPrompt = useDisclosure()


  // method to update Lesson
  const onHandleUpdateLesson = (e:any)=>{
    e.preventDefault()
    setIsLoading(true)
    api.put(`lesson/${id}`,{
      title:Lesson?.title,
      description:Lesson?.description
      
    },{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setLesson({
        id:Lesson?.id,
        title:res.data?.title,
        description: res.data?.description,
        resourceLessons:Lesson?.resourceLessons,
        videolessons:Lesson?.videolessons,
        textLessons:Lesson?.textLessons
      })
     
      setIsLoading(false)

      toast({
            title: 'Lesson successfully updated',
            description: "",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
      }).catch(err=>{
          toast({
            title: 'Could not update Lesson',
              description: "",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })

          setIsLoading(false)
      })

  }

  // method to load Lesson info
  useEffect(()=>{

    setIsLoading(true)
    api.get(`Lesson/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      setLesson(res.data)
     
      setIsLoading(false)
  }).catch(err=>{
  
      setIsLoading(false)
  })

  },[])

  const onHandleDeleteTextLesson=(txtLID:number)=>{

    setIsLoading(true)

    api.delete(`textLesson/${txtLID}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newTextLessons = Lesson?.textLessons?.filter(
        txtL=>(txtL.id != txtLID)
      )

      toast({
        title: 'Text Lesson deleted permanently',
          description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setLesson({
        id:Lesson?.id,
        title:Lesson?.title,
        description:Lesson?.description,
        resourceLessons:Lesson?.resourceLessons,
        videolessons:Lesson?.videolessons,
        textLessons:newTextLessons
      })
      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Lesson text',
          description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)
    })
  }

  const onHandleDeleteVideoLesson=(videoId:number)=>{

    setIsLoading(true)

    api.delete(`videoLesson/${videoId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newVideoLesson = Lesson?.videolessons?.filter(
        rL=>(rL.id != videoId)
      )

      setLesson({
        id:Lesson?.id,
        title:Lesson?.title,
        description:Lesson?.description,
        resourceLessons:Lesson?.resourceLessons,
        videolessons:newVideoLesson,
        textLessons:Lesson?.textLessons
      })

      toast({
        title: 'Video Lesson deleted permanently',
          description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Lesson Video',
          description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)
    })
    }

  const onHandleDeleteResourceLesson=(resourceId:number)=>{

    setIsLoading(true)

    api.delete(`resourceLesson/${resourceId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newResourceLessons = Lesson?.resourceLessons?.filter(
        rL=>(rL.id != resourceId)
      )

      setLesson({
        id:Lesson?.id,
        title:Lesson?.title,
        description:Lesson?.description,
        resourceLessons:newResourceLessons,
        videolessons:Lesson?.videolessons,
        textLessons:Lesson?.textLessons
      })

      toast({
        title: 'Resource Lesson deleted permanently',
          description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete Lesson Resource',
          description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
      setIsLoading(false)
    })
    }

  return (
    <>
    <SidebarWithHeader>
          <ModalCreateVideoLesson isOpen={modalCreateVideoLesson.isOpen} onClose={modalCreateVideoLesson.onClose} />
          <ModalCreateResourceLesson isOpen={modalCreateResourceLesson.isOpen} onClose={modalCreateResourceLesson.onClose} />
          <ModalCreateTextLesson isOpen={modalCreateTextLesson.isOpen} onClose={modalCreateTextLesson.onClose} />
          <Loader isLoading={isLoading}/>


          <VerifyPrompt onClose={verifyPrompt.onClose} onOpen={verifyPrompt.onOpen} isOpen={verifyPrompt.isOpen} >
            <Button color={"red.400"} onClick={verifyPrompt.onClose} >Ok</Button>          
          </VerifyPrompt>

          <Container maxW="3xl" >
          <Stack w="100%" margin={"0 auto"} spacing={4}>
              <Heading textAlign={"center"} w="100%">
                Lesson Info
              </Heading>
                <form onSubmit={onHandleUpdateLesson}>
                  <FormLabel>
                    Title:
                  </FormLabel>
                <FormControl>
                <Input onChange={e=> setLesson({
                  id:Lesson?.id,
                  title:e.target.value,
                  description:Lesson?.description,
                  resourceLessons:Lesson?.resourceLessons,
                  textLessons:Lesson?.textLessons,
                  videolessons:Lesson?.videolessons
                })} p="4" py="8" bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} defaultValue={Lesson?.title} ></Input>
                
                 </FormControl> 

                 <FormLabel>
                    Description:
                  </FormLabel>
                <FormControl>
                <Textarea onChange={e=> setLesson({
                  id:Lesson?.id,
                  title:Lesson?.title,
                  description:e.target.value,
                  resourceLessons:Lesson?.resourceLessons,
                  textLessons:Lesson?.textLessons,
                  videolessons:Lesson?.videolessons
                })} p="4" py="8" bg={useColorModeValue("gray.50","gray.900")} fontSize={"xl"} defaultValue={Lesson?.description} ></Textarea>

                 </FormControl> 
 
                 <ButtonGroup display='flex' justifyContent='flex-end'>
                
                 <Button onClick={onHandleUpdateLesson} colorScheme='pink'>
                   Save
                 </Button>
                 </ButtonGroup>
                </form>
               
          </Stack>
            <Heading mt="4" textAlign={"center"} w="100%">
              Texts
            </Heading>
            <Flex w="100%"mt="2" justifyContent={"space-between"}  >
            <Button onClick={modalCreateTextLesson.onOpen}  colorScheme="pink" >Add a Text</Button>
            <Checkbox onChange={(e)=>{
              setIsDeletingEnableTextLesson(e.target.checked)

              if(e.target.checked){
                verifyPrompt.onOpen()
              }

            }}>
              Enable Delete
            </Checkbox>
            </Flex>
           <List mt="4"  w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
                 
                 {
                   Lesson?.textLessons?.map(TextLesson=>(
                     <ListItem key={TextLesson.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                               
                       <Flex alignItems={"center"} w="100%" justifyContent={"space-between"} p="2">
                          <Box display="flex" alignItems={"center"}>
                          <Text pl="4" fontSize={"large"}>{TextLesson.title}  </Text> 
                              {/* content */ }
                              <Popover >
                              <PopoverTrigger>
                                <Button ml="4"><BsEye size={"20"}></BsEye></Button>
                              </PopoverTrigger>
                              <PopoverContent >
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Content</PopoverHeader>
                                <PopoverBody>
                                    <div
                                        dangerouslySetInnerHTML={{__html: TextLesson.content}}
                                      />
                                  
                                </PopoverBody>
                              </PopoverContent>
                              </Popover>
                          </Box>


                          <Button onClick={()=>{
                            onHandleDeleteTextLesson(TextLesson.id)
                          }} display={"flex"} disabled={!isDeletingEnableTextLesson} justifyContent={"space-between"} bg="red.400">
                            <span>
                            Delete 
                            </span>
                            <BsTrash ></BsTrash>
                            
                          </Button>
                         
                       </Flex>
                              
                 </ListItem>
                   ))
                 }
                 
                 {Lesson?.textLessons?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no Lesson Texts</Text>}
                 
                     
             </List>

             <Heading mt="4"  textAlign={"center"} w="100%">
              Videos
            </Heading>
            <Flex w="100%"mt="2" justifyContent={"space-between"}  >
            <Button onClick={modalCreateVideoLesson.onOpen} colorScheme="pink" >Add a Video</Button>
            <Checkbox onChange={(e)=>{
              setIsDeletingEnableVideoLesson(e.target.checked)

              if(e.target.checked){
                verifyPrompt.onOpen()
              }

            }}>
              Enable Delete
            </Checkbox>
            </Flex>
           <List mt="4"  w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
                 
                 {
                   Lesson?.videolessons?.map(videoLesson=>(
                     <ListItem key={videoLesson.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                              
                     <Flex alignItems={"center"} w="100%" justifyContent={"space-between"} p="2">
                          <Box display="flex" alignItems={"center"}>
                          <Text pl="4" fontSize={"large"}>{videoLesson.title}  </Text> 
                              {/* content */ }
                              <Popover >
                              <PopoverTrigger>
                                <Button ml="4"><BsEye size={"20"}></BsEye></Button>
                              </PopoverTrigger>
                              <PopoverContent >
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Content</PopoverHeader>
                                <PopoverBody>
                                    <a href={videoLesson.url}><Text color={"pink"}>{videoLesson.title}</Text></a>
                                  
                                </PopoverBody>
                              </PopoverContent>
                              </Popover>
                          </Box>

                          <Button disabled={!isDeletingEnableVideoLesson} onClick={()=>{
                            onHandleDeleteVideoLesson(videoLesson.id)
                          }} bg="red.400">
                            
                            Delete {" "}
                            <BsTrash></BsTrash>
                            
                          </Button>

                       </Flex>
                          
                    </ListItem>
                   ))
                 }
                 
                 {Lesson?.videolessons?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no Videos</Text>}
                 
                     
             </List>

             <Heading mt="4" textAlign={"center"} w="100%">
              Resource Texts
            </Heading>
            <Flex w="100%"mt="2" justifyContent={"space-between"}  >
            <Button onClick={modalCreateResourceLesson.onOpen} colorScheme="pink" >Add a Resource</Button>
            <Checkbox onChange={(e)=>{
              setIsDeletingEnableResourceLesson(e.target.checked)

              if(e.target.checked){
                verifyPrompt.onOpen()
                
              }

            }}>
              Enable Delete
            </Checkbox>
            </Flex>
           <List mt="4"  w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
                 
                 {
                   Lesson?.resourceLessons?.map(resourceLesson=>(
                     <ListItem key={resourceLesson.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                     <Flex alignItems={"center"} w="100%" justifyContent={"space-between"} p="2">
                          <Box display="flex" alignItems={"center"}>
                          <Text pl="4" fontSize={"large"}>{resourceLesson.title}  </Text> 
                              {/* content */ }
                              <Popover >
                              <PopoverTrigger>
                                <Button ml="4"><BsEye size={"20"}></BsEye></Button>
                              </PopoverTrigger>
                              <PopoverContent >
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Content</PopoverHeader>
                                <PopoverBody>
                                    <div
                                        dangerouslySetInnerHTML={{__html: resourceLesson.link}}
                                      />
                                  
                                </PopoverBody>
                              </PopoverContent>
                              </Popover>
                          </Box>

                          <Button disabled={!isDeletingEnableResourceLesson} onClick={()=>{
                            onHandleDeleteResourceLesson(resourceLesson.id)
                          }} bg="red.400">
                            
                            Delete {" "}
                            <BsTrash></BsTrash>
                            
                          </Button>
                      
                       </Flex>        
                      </ListItem>
                   ))
                 }
                 
                 {Lesson?.resourceLessons?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no Resource Lessons</Text>}
                 
                     
             </List>
   
            
          </Container>
           
    </SidebarWithHeader>
    </>
  );
}