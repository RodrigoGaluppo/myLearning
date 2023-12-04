import {  Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    Icon,
    useColorModeValue,
    createIcon,
    SimpleGrid,
    useToast,
    Flex,
    VStack,
    Input,
    Avatar,
    Center,FormControl,FormErrorMessage,
    useBreakpointValue,
    Select,
    FormLabel,
    FormHelperText, } from "@chakra-ui/react"
import ProductCard from "../components/Card"
import Header from "../components/Header"
import { useContext, useEffect, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";


interface IUser{
    firstName:string | undefined;
    lastName:string | undefined;
    email:string | undefined;
    username:string | undefined;
    gender:string | undefined;
    birthDate:string | undefined;
}

interface IGender{
    abv:string
    value:string
}

const genders:IGender[] = [
    {abv:"F",value:"Female"},
    {abv:"M",value:"Male"},
    
    {abv:"O",value:"Other"}
]

export default function Profile(){

    const {token,updateUser} = useAuth()

    const [user, setUser] = useState<IUser>()

    const toast = useToast()
    const authContext = useAuth()
    const [isLoading,setIsLoading] = useState(false)

    useEffect(()=>{
        setIsLoading(true)
        api.get("/",{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
           
            setUser(res.data)
            setIsLoading(false)
        }).catch(err=>{
            toast({
                title: 'error',
                description: "could not load user info",
                status: 'error',
                duration: 9000,
                isClosable: true, position:"top-left"
              })
            setIsLoading(false)
        })
    },[])

    const onHandleSubmit= ()=>{
        
        if(!!user && user.email != null)
            if(/\S+@\S+\.\S+/.test(user.email) == false)
            {
                toast({
                    title: 'error',
                    description: "you must provide a valid e-mail",
                    status: 'error',
                    duration: 9000,
                    isClosable: true, position:"top-left"
                  })
                return
            }

           

        if (user?.firstName === "" || user?.lastName === "" || user?.email === "" || user?.username === "" || user?.gender === "" || user?.birthDate == "")
        {
            toast({
                title: 'error',
                description: "one or more required fields are empty",
                status: 'error',
                duration: 9000,
                isClosable: true, position:"top-left"
              })
            return
        }
        
        setIsLoading(true)
        api.put("/",{
            firstName:user?.firstName,
            lastName:user?.lastName,
            username:user?.username,
            gender:user?.gender,
            birthDate:user?.birthDate
        },{ 
            headers: {"Authorization" : `Bearer ${token}`}
        }).then((res)=>{
           
            setUser(res.data)
            toast({
                title: 'success',
                description: "user was successfully updated",
                status: 'success',
                duration: 9000,
                isClosable: true, position:"top-left"
              })
              
            updateUser(res.data)
            setIsLoading(false)
        }).catch(err=>{
            toast({
                title: 'error',
                description: "could not update user info",
                status: 'error',
                duration: 9000,
                isClosable: true, position:"top-left"
              })
            setIsLoading(false)
        })
    }

    return(
        <Box  > 
            
            <Header  />
            <Loader isLoading={isLoading} />
            <Container  maxW={'3xl'}>
            <Stack
               
                as={Box}
                
                w="100%s"
                textAlign={'center'}
                spacing={{ base: 6, md: 8 }}
                py={{ base: 10, md: 16 }}>
                <Heading
                    w="100%"
                    fontWeight={600}
                    fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
                    lineHeight={'100%'}>
                    
                    Information
                    
                </Heading>

                <Flex justifyContent={"center"} flexWrap={"wrap"}>
                    <Flex h="100%" w={useBreakpointValue({ base:"40%",sm: '100%', md: '40%'})} justifyContent={"center"}>
                      <Center>
                        <VStack spacing={"4"}>
                        <Avatar name={authContext.user.firstName} size="2xl" fontSize={"4xl"} minW="44" minH="44" ></Avatar>
                        
                        </VStack>
                      </Center>
                    </Flex>
                    <form onSubmit={(e)=>{
                        e.preventDefault()

                        onHandleSubmit()

                    }} style={{width:"100%",height:"100%"}}>
                    <VStack 
                    mt={useBreakpointValue({ base:"0",sm: '8', md: '0'})}
                    spacing={"2.5"}
                    flex={"1"}
                    justifyContent={"left"}
                    >
                    
                    <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                        placeholder="First Name"
                        defaultValue={user?.firstName}
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        onChange={(e)=>{
                            
                            setUser({firstName:e.target.value, lastName:user?.lastName, email:user?.email, birthDate: user?.birthDate, gender:user?.gender, username:user?.username })
                        }}
                        
                        />
                         <FormHelperText></FormHelperText>
                        </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Surname</FormLabel>
                        <Input
                        placeholder="Last name"
                        defaultValue={user?.lastName}
                        onChange={(e)=>{
                            setUser({firstName:user?.firstName, lastName:e.target.value, email:user?.email, birthDate: user?.birthDate, gender:user?.gender, username:user?.username })
                        }}
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        
                        />
                        <FormControl mt="4" >
                        <FormLabel>E-mail</FormLabel>
                        <Input
                        disabled
                        onChange={(e)=>{
                            setUser({firstName:user?.firstName, lastName:user?.lastName, email:e.target.value, birthDate: user?.birthDate , gender:user?.gender, username:user?.username})
                        }}
                        placeholder="firstname@lastname.io"
                        bg={'gray.100'}
                        defaultValue={user?.email}
                        border={0}
                        type='email'
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}

                        />

                        <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                        placeholder="userName"
                        onChange={(e)=>{
                            setUser({firstName:user?.firstName, lastName:user?.lastName, email:user?.email, birthDate: user?.birthDate, gender:user?.gender, username:e.target.value })
                        }}
                        defaultValue={user?.username}
                        bg={'gray.100'}
                        border={0}
                        type='tezt'
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        
                        />
                        <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl isRequired>
                        <FormLabel>Birthdate</FormLabel>
                        <Input
                        
                        bg={'gray.100'}
                        border={0}
                        type='date'
                        onChange={(e)=>{
                            setUser({firstName:user?.firstName, lastName:user?.lastName, email:user?.email, birthDate: e.target.value , gender:user?.gender, username:user?.username})
                        }}
                        defaultValue={user?.birthDate}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}

                        />
                         <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl isRequired>
                        <FormLabel>Gender</FormLabel>
                        <Select
                         onChange={(e)=>{
                            setUser({firstName:user?.firstName, lastName:user?.lastName, email:user?.email, birthDate: user?.birthDate , gender:e.target.value, username:user?.username})
                        }}
                        
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}

                        
                        >
                        
                        {genders.map((gender)=>(
                            <option selected={gender.abv === user?.gender} value={gender.abv}>{gender.value}</option>
                        )
                        )}
                        </Select>
                        <FormHelperText></FormHelperText>
                        </FormControl>
                     

                    <Input
                    fontFamily={'heading'}
                    mt={8}
                        type="submit"
                        value="Edit"
                    w={'full'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    color={'white'}
                    _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                    }}/>
                    

                    </VStack>
                    </form>
                </Flex>
            </Stack>                

        </Container>
    </Box>
    )
}

