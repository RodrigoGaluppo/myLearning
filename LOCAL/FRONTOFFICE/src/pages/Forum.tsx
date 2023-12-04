import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    IconProps,
    Icon,
    useColorModeValue,
    Image,
    ListItem,
    List,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    ModalFooter,
    Center,
    InputGroup,
    InputRightElement,
    InputRightAddon
  } from '@chakra-ui/react';
import { Link, redirect, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { useToast } from '@chakra-ui/react'
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { FiArrowLeft, FiArrowRight, FiBook, FiSearch } from 'react-icons/fi';
import Loader from '../components/Loader';
import api from '../services/apiClient';
import { FaTrash } from 'react-icons/fa';


  interface Question{
    id:string
    title:string;
    content:string;
    customer:{
      username:string
    }
  }

  interface Course{
    name:string
  }

  // funciton component to create a new question

  const ModalCreateQuestion = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{
    

    const [title,setTitle] = useState("")
    const [question,setQuestion] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const {id} = useParams()
    const navigate = useNavigate()    
    const toast = useToast()
    const {token,user} = useAuth()

    const handleSendQuestion = ()=>{
      setIsLoading(true)

      api.post("question",{
        courseId:id,
        title,
        content:question
      },{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res=>{
        toast({
          title: 'question successfully published',
          description: "",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        setIsLoading(false)

        onClose()

        navigate("/question/"+ res.data.id)
        
        
      }).catch(()=>{
        toast({
          title: 'Could not publish question',
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
          <ModalHeader>Make a New Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl>
              <FormLabel>Title</FormLabel>
              <Input onChange={(e)=>{
                setTitle(e.target.value)
              }} placeholder='Title' />
            </FormControl>

            <FormControl mt="2">
              <FormLabel>Question</FormLabel>
              <Input onChange={(e)=>{
                setQuestion(e.target.value)
              }} placeholder='Question' />
            </FormControl>

            
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=>{handleSendQuestion()}} colorScheme='pink' mr={3}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  export default function Forum() {

   
    const toast = useToast()

    const  [searchParams, setSearchParams] = useSearchParams()

    const [maxPage, setMaxPage] = useState(0)

    const [course,setCourse] = useState<Course>()

    const [questions,setQuestions] = useState<Question[]>()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {token,user} = useAuth()

    const {id} = useParams()

    const [isLoading,setIsLoading] = useState(false)

    useEffect(()=>{
      api.get(`course/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
        setCourse(res.data)
      })
      .catch(()=>{

      })
    },[])

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
      
      let search:string = `question/list?page=${searchParams.get("page") || 1}&search=${ searchParams.get("search") || "" }`
   
      search += `&courseId=${id}`

      api.get(search,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
         
          setQuestions(res?.data?.questions)
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

    const forumBg = useColorModeValue("gray.200", "gray.800")

    return (
      <>
       <Loader isLoading={isLoading} />
       <ModalCreateQuestion isOpen={isOpen} onClose={onClose} />
      <Box position={'relative'}>
      
      <Header  />      
        <Container
          
          maxW={'5xl'}
        
          py={{ base: 10, sm: 20, lg: 32 }}
         
          >
          
          <Stack
            bg={useColorModeValue('gray.100', 'gray.700')}
            rounded={'xl'}

            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
             w="100%">
            <Heading textAlign={"center"}>
              {course?.name} Questions 
            </Heading>
            <Box>
              <Button  bg='pink.400' onClick={onOpen}>New Question</Button>
            
            </Box>
            <Center>
                <InputGroup w="100%" m="0 auto" size='md'>
                
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
            </Center>

           
            <List w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowY={"auto"} >
            
                {questions?.map(question=>(
                 
                    <ListItem bg={forumBg} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                        
                        <Flex w="100%">
                          <Link style={{width:"100%",height:"100%", display:"flex"}} to={`/question/${question.id}`}>          
                          
                          <Avatar mr="4" name={question.customer.username}></Avatar>         
                          <Text fontSize={"large"}>{question.title}  </Text> 
                          </Link> 
                          
                          </Flex>
                                 
                    </ListItem>
                   

                ))}
            </List>

            <Flex justifyContent={"space-between"}>
            <Button colorScheme="pink"  onClick={handleClickPrevious} size={"lg"}>
                    <FiArrowLeft/> Previous
                </Button>

                <Button colorScheme="pink" onClick={handleClickNext} size={"lg"}>
                    Next <FiArrowRight/>
                </Button>
            </Flex>

            </Stack>
        </Container>
        <Blur
          position={'absolute'}
          top={-39}
          left={-200}
        
          style={{ filter: 'blur(70px)' }}
        />
      </Box>
      </>
    );
  }
  
  export const Blur = (props: IconProps) => {

    const breakPointW = useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })
    const breakPointZIndex = useBreakpointValue({ base: -1, md: -1, lg: 0 })
    return (
      <Icon
        width={breakPointW}
        zIndex={breakPointZIndex}
        height="560px"
        viewBox="0 0 528 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <circle cx="71" cy="61" r="111" fill="#F56565" />
        <circle cx="244" cy="106" r="139" fill="#ED64A6" />
        <circle cy="291" r="139" fill="#ED64A6" />
        <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
        <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
        <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
        <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
      </Icon>
    );
  };