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


  export default function COnfirmEMail() {

    const [emailVerified,setEmailVerified] = useState(false)
    const [error,setError] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
   
    const {customedId} = useParams()
   
    const toast = useToast()

   
    useEffect(()=>{
      setIsLoading(true)


      api.put(`confirm/${customedId}`)
      .then((res)=>{
     
        if(!res.data?.isConfirmed)
          throw new Error()

        setEmailVerified(res.data?.isConfirmed)
      
        
        setIsLoading(false)
      })
      .catch((e)=>{
        console.log(e);
        
        setIsLoading(false)
        setError(true)
      })
  },[])

    return (
      
      <Box position={'relative'}>
      <Header  />
        <Loader isLoading={isLoading}/>
        <Container
      
          maxW={'5xl'}
        
          py={{ base: 10, sm: 20, lg: 32 }}
      
          >
          {emailVerified && 
         
          (

            <Stack
            bg={'gray.700'}
            rounded={'xl'}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: 'lg' }}
            margin={"0 auto"}
            >
                <Heading textAlign={"center"} w="100%" >Your email has been verified</Heading>
          
              <Flex flexWrap={"wrap"} justifyContent={"center"}>
            
               <Icon w="100%" color={"green.300"} fontSize={"9xl"} as={CheckCircleIcon }>

               </Icon>
               <Text mt="6" fontSize={"lg"}><Link to="/">
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
               <Heading textAlign={"center"} w="100%" >could not verify e-mail</Heading>
         
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