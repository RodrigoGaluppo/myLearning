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
    Select,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
  } from '@chakra-ui/react';


import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import Loader from './Loader';
import { useAuth } from '../hooks/AuthContext';

  
  interface ICustomer{

    firstName?: string | undefined
    lastName?: string | undefined
    email?: string | undefined
    username?: string | undefined
    password?: string | undefined
    passwordConfirmation?:string | undefined
    gender?: string | undefined
    birthDate?:string | undefined

  }

  

  export default function ModalRegisterCustomer({isOpen,onClose}: {isOpen:boolean, onClose:()=>void}) {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [username, setUserName] = useState("")
    const [gender, setGender] = useState("M")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const [isLoading,setIsLoading] = useState(false)
    const {token} = useAuth()

    const toast = useToast()

    function isDateBetweenValidYears(dateString:string, startYear:number, endYear:number) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Assuming the date format is YYYY-MM-DD
        if (!dateRegex.test(dateString)) {
        return false; // Date format is invalid
        }
    
        const inputYear = parseInt(dateString.substring(0, 4), 10);
        return inputYear >= startYear && inputYear <= endYear;
    }

    function onHandleSubmit(){


     

      if(birthDate == "" || firstName == "" || gender == "" || lastName == "" || email == "" || password == "" || passwordConfirmation == "" || username == "" )
      {
        toast({
          title: 'Invalid fields',
          description: "one or more fields can not be empty",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
            
        return
      }
      const startDate = new Date(1890, 0, 1); // January 1, 2022
      const endDate = new Date(); // Now

    // Date string in the format YYYY-MM-DD

      const isValidDate = isDateBetweenValidYears(birthDate, startDate.getFullYear(), endDate.getFullYear());
    
      if(!isValidDate){
        toast({
            title: 'Invalid fields',
            description: "Invalid date",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position:"top-left"
          })
        return
    }

      if(passwordConfirmation !== password){
        toast({
          title: 'Invalid fields',
          description: "passwords must match",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        return
      }
      setIsLoading(true)
      api.post("customer",{
        firstName,
        lastName,
        email,
        username,
        password,
        gender,
        birthDate
    },{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(()=>{
        toast({
          title: firstName + " Resgitered successfully" ,
          description: "he may log-in now",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        onClose()
        setIsLoading(false)
      })
      .catch((err)=> {

        console.log(err)
        toast({
          title: 'Erro',
          description: "could not Register user",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
        setIsLoading(false)
        return
      })

    }

    return (
        <Modal  
        isOpen={isOpen}
        onClose={onClose}
      >
        <Loader isLoading={isLoading} />
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register a Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Container
            maxW={'7xl'}
            w="100%"
            py={2}>
    
            <Stack
                bg={useColorModeValue('gray.100', 'gray.700')}
                rounded={'xl'}
                p={{ base: 4 }}
                spacing={{ base: 8 }}
                maxW={{ lg: 'lg' }}>
                <Stack spacing={4}>
                <Heading
                    color={useColorModeValue('gray.800', 'gray.50')}
                    lineHeight={1.1}
                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                    Register a Customer
                    <Text
                    as={'span'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    bgClip="text">
                    !
                    </Text>
                </Heading>
                
                </Stack>
                <Box as={'form'} mt={10}>
                <Stack spacing={4}>
        
                <Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    Name:
                    </Text>
                    <Input
                    placeholder="Firstname"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}
                    
                    onChange={(e)=>{
                        setFirstName(e.target.value)
                    }}
                    />
                    <Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    LastName:
                    </Text>
                    <Input
                    placeholder="LastName"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}
                    onChange={(e)=>{
                        setLastName(e.target.value)
                    }}
                    />

                < Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    Username:
                    </Text>
                    <Input
                    placeholder="Username"
                    bg={'gray.100'}
                    border={0}
                    type='tezt'
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}
                    onChange={(e)=>{
                        setUserName(e.target.value)
                    }}
                    />
                    
                    < Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    BirthDate:
                    </Text>
                    <Input
                    
                    bg={'gray.100'}
                    border={0}
                    type='date'
                    
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}

                    onChange={(e)=>{
                        setBirthDate(e.target.value)
                    }}

                    />

                    <Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    Gender:
                    </Text>
                    <Select
                    
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}

                    onChange={(e)=>{
                        setGender(e.target.value)
                    }}
                    >
                    <option selected value={"M"} >Male</option>
                    <option value={"F"}>Female</option>
                    <option value={"O"}>Other</option>
                    </Select>
                    <Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    Email:
                    </Text>
                    <Input
                    placeholder="firstname@lastname.io"
                    bg={'gray.100'}
                    border={0}
                    type='email'
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}

                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                    />

                    < Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    Password:
                    </Text>
                    <Input
                    placeholder=""
                    bg={'gray.100'}
                    border={0}
                    type='password'
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}

                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                    />

                < Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: 'sm', sm: 'md' }}>
                    Password Confirmation:
                    </Text>
                    <Input
                    placeholder=""
                    bg={'gray.100'}
                    border={0}
                    type='password'
                    color={'gray.500'}
                    _placeholder={{
                        color: 'gray.500',
                    }}

                    onChange={(e)=>{
                        setPasswordConfirmation(e.target.value)
                    }}
                    />

                </Stack>
                <Button
                    fontFamily={'heading'}
                    mt={8}
                    w={'full'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    color={'white'}
                    _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                    }}
                    onClick={onHandleSubmit}
                    >
                    Submit
                </Button>
                </Box>
                form
            </Stack>
            </Container>
        </ModalBody>
  
    <ModalFooter>
        <Button onClick={()=>{onHandleSubmit()}} colorScheme='pink' mr={3}>
        Send
        </Button>
        <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
    </ModalContent>
    </Modal>
    );
  }
  
  