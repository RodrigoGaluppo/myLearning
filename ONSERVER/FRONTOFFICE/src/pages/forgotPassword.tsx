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
    FormControl,
    VStack,
    
  } from '@chakra-ui/react';
import { Link, redirect, useParams } from 'react-router-dom';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { useToast } from '@chakra-ui/react'
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import api from '../services/apiClient';
import Loader from '../components/Loader';


  export default function ForgotPassword() {

    const [passwordChanged,setPasswordChanged] = useState(false)
    const [error,setError] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [password,setPassword] = useState("")
    const [passwordConfirmation,setPasswordConfirmation] = useState("")
    const {tokenId} = useParams()
   
    const toast = useToast()
   
    const onHandleSubmit= ()=>{
     

      if(password == "" || passwordConfirmation == ""){
        toast({
          title: 'Passwords can not be empty',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        return
      }

      if(password != passwordConfirmation){
        toast({
          title: 'Passwords must match',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        return
      }

      setIsLoading(true)
      api.put(`changepassword/${tokenId}`,{
        newPassword:password
      })
      .then((res)=>{
     
     
          setPasswordChanged(true)
      
        
        setIsLoading(false)
      })
      .catch((err)=>{
        setIsLoading(false)
        setError(true)
        toast({
          title: 'error',
          description:  err?.response?.data?.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
      })
    }

    return (
      
      <Box position={'relative'}>
      <Header  />
        <Loader isLoading={isLoading}/>
        <Container
      
          maxW={'5xl'}
        
          py={{ base: 10, sm: 20, lg: 32 }}
      
          >

          {
            !passwordChanged && !error && 
            (
              <Box maxW="xl" margin={"0 auto"}>
              <form  onSubmit={onHandleSubmit}>
                <VStack spacing={"4"}>
                  <Heading>Change Password</Heading>
                  <FormControl>
                     <Text>new password</Text>
                      <Input
                                mt="2"
                        required
                        onChange={e =>{ setPassword(e.target.value.toString()) }}
                        placeholder="password"
                        background={"gray.200"} 
                        border={0}
                        type='password'
                        color={'gray.500'}
                        _placeholder={{
                          color: 'gray.500',
                        }}
                      />
                   </FormControl>

                   <FormControl>
                     <Text>new password confirmation</Text>
                      <Input
                      mt="2"
                        required
                        onChange={e =>{ setPasswordConfirmation(e.target.value.toString()) }}
                        placeholder="password confirmation"
                        background={"gray.200"} 
                        border={0}
                        type='password'
                        color={'gray.500'}
                        _placeholder={{
                          color: 'gray.500',
                        }}
                      />
                   </FormControl>

                   <FormControl>
                    <Button  mt="2" size={"lg"} bg="pink.400" onClick={onHandleSubmit} >Change</Button>
                   </FormControl>
                </VStack>
              </form>
              </Box>
             
            )
          }


          {passwordChanged && 
         
          (

            <Stack
            bg={'gray.700'}
            rounded={'xl'}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: 'lg' }}
            margin={"0 auto"}
            >
                <Heading textAlign={"center"} w="100%" >Your password has been modified</Heading>
          
              <Flex flexWrap={"wrap"} justifyContent={"center"}>
            
               <Icon w="100%" color={"green.300"} fontSize={"9xl"} as={CheckCircleIcon }>

               </Icon>
               <Text color="pink.400" mt="6" fontSize={"lg"}><Link to="/">
               you may log-in now !
               </Link></Text>
              </Flex>
           
           </Stack>


          )

          }

        {error && 
         
         (

           <Stack
           bg={'gray.700'}
           rounded={'xl'}
           p={{ base: 4, sm: 6, md: 8 }}
           spacing={{ base: 8 }}
           maxW={{ lg: 'lg' }}
           margin={"0 auto"}
           >
               <Heading textAlign={"center"} w="100%" >could not change your password</Heading>
         
             <Flex flexWrap={"wrap"} justifyContent={"center"}>
           
              <Icon w="100%" color={"red.300"} fontSize={"9xl"} as={CloseIcon }>

              </Icon>
              <Text mt="6" fontSize={"lg"}>try again later !</Text>
             </Flex>
          
          </Stack>


         )

         }
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