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
  
    ListItem,
    List,
    
    VStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    ModalFooter
  } from '@chakra-ui/react';
import { Link, redirect, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { useToast } from '@chakra-ui/react'
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';

import { FiArrowLeft, FiArrowRight, FiBook, FiSearch } from 'react-icons/fi';
import api from '../services/apiClient';
import Loader from '../components/Loader';
import { FaTrash } from 'react-icons/fa';
import VerifyPrompt from '../components/VerifyPrompt';



  interface Comment{
    content:string;
    customerUsername:string
  }

  interface Question{
    title:string;
    content:string;
    username:string,
    createdAt:string
    comments:Comment[]
    courseId:string
  }

  

  // function component of modal to craete a comment
  const ModalCreateComment = ({isOpen,onClose}: {isOpen:boolean, onClose:()=>void})=>{
    
    const [comment,setComment] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const {id} = useParams()    
    const toast = useToast()
    const {token} = useAuth()

    const handleSendComment = ()=>{
      setIsLoading(true)

      api.post("comment",{
        questionId:id,
        content:comment
      },{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res=>{
        toast({
          title: 'comment successfully published',
          description: "",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        setIsLoading(false)

        onClose()
        
      }).catch(()=>{
        toast({
          title: 'Could not publish comment',
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
          <ModalHeader>Comment on this question</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Comment</FormLabel>
              <Input onChange={(e)=>{
                setComment(e.target.value)
              }} placeholder='Comment' />
            </FormControl>

            
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=>{handleSendComment()}} colorScheme='pink' mr={3}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  export default function Question() {

   
    const toast = useToast()

    const { id } = useParams() //

    const [question,setQuestion] = useState<Question>()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {token,user} = useAuth()

    const [isLoading,setIsLoading] = useState(false)

    const navigate = useNavigate()

    const modalDeleteQuestion = useDisclosure()

    useEffect(()=>{

      setIsLoading(true) 
      
      api.get(`question/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
         
          setQuestion(res?.data)
        
          setIsLoading(false)
      }).catch(err=>{
          console.log(err);
          setIsLoading(false)
          toast({
            title: 'Could not load question',
            description: "",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
      })

    },[isOpen])

    const handleDeleteQuestion = ()=>{
      setIsLoading(true)
  
  
      api.delete("question/"+id,{ headers: { "Authorization": `Bearer ${token}` } })
      .then((res) => {
          
        setIsLoading(false)
  
        navigate("/forum/"+question?.courseId)
      }).catch(err => {
        
        setIsLoading(false)
  
        toast({
          title: 'Could not delete question',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
      })
  
    }
  

    const forumBg = useColorModeValue("gray.200", "gray.800")

    return (
      
      <Box position={'relative'}>
      
      <Header  />
       <ModalCreateComment isOpen={isOpen} onClose={onClose} />
      <Loader isLoading={isLoading} />
        <Container
          
          maxW={'5xl'}
        
          py={{ base: 10, sm: 20, lg: 32 }}
         
          >

          <VerifyPrompt
            isOpen={modalDeleteQuestion.isOpen} onClose={modalDeleteQuestion.onClose} onOpen={modalDeleteQuestion.onOpen}
            >
                <Text>If you delete this question it will no longer be available</Text>
                <Button mt="2" bg={"red.400"} onClick={handleDeleteQuestion} >Proceed</Button>
          </VerifyPrompt>
          <Stack
            bg={useColorModeValue('gray.100', 'gray.700')}
            rounded={'xl'}

            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
             w="100%">
              <VStack spacing={"4"}>

              <Flex justifyContent={"space-between"} w="100%">

              <Flex alignItems={"center"}>
                  <Avatar mr="4" name={question?.username}></Avatar>         
                  <Text fontSize={"medium"}>{question?.username}  </Text>
              </Flex>

              <Text fontSize={"medium"}> {new Date(String(question?.createdAt)).toLocaleString("pt-PT")}</Text>

              </Flex>

                <Heading fontSize={"3xl"} w="100%"  textAlign={"center"}>
                  {question?.title} 
                </Heading>

                <Text >
                  {question?.content} 
                </Text>
               
              </VStack>

            <Flex justifyContent={"space-between"}>
               <Text fontSize={"large"}>Answers: </Text>
               <Button bg='pink.400' onClick={onOpen}>New Comment</Button>
            </Flex>
           

            <List mb="4" pb="4" spacing={2} maxH="400px" overflowY={"auto"} >
            
                {question?.comments?.map(comment=>(

                    
                  <ListItem key={comment.content + new Date().toISOString()} bg={forumBg} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                                    
                      <Avatar mr="4" name={comment.customerUsername}></Avatar>   

                      <Box>
                        
                      <Text fontWeight={"bold"} color="pink.400" fontSize={"medium"}>{comment.customerUsername} </Text> 
                        <Text fontSize={"medium"}>{comment.content} </Text>   
                      </Box>         
                    </ListItem>
                    

                ))}
            </List>

            {
                    question?.username === user.username && 
                    <Button onClick={modalDeleteQuestion.onOpen} bg="red.400">
                      Delete <Box ml="2"><FaTrash /></Box>  
                    </Button>
              }

            </Stack>
        </Container>
        <Blur
          position={'absolute'}
          top={-39}
          left={-200}
        
          style={{ filter: 'blur(70px)' }}
        />
      </Box>
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