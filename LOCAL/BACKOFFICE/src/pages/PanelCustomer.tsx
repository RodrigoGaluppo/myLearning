import { Center, Flex, Grid, GridItem,Textarea,Text, Heading, Icon,Image, SimpleGrid, useColorModeValue, Stack, Input, ButtonGroup, Button, IconButton, Box, useBreakpointValue, FormControl, useTab, useToast, useDisclosure, List, ListItem, Container, InputGroup, InputRightElement, InputRightAddon, ModalOverlay, ModalContent, FormLabel, ModalBody, ModalHeader, ModalCloseButton, ModalFooter, Modal, VStack, Checkbox, Avatar, FormHelperText, Select } from "@chakra-ui/react";
import SidebarWithHeader from "../components/SideBar";
import { LegacyRef, useEffect, useRef, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Switch } from '@chakra-ui/react'


interface IChapter{
  id:number;
  title:string
}


interface ICustomer{
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


export default function PanelCustomer() {
  
  const {token} = useAuth()

  const [customer, setCustomer] = useState<ICustomer>()
  const [isActive, setIsActive] = useState(false)
  const {id} = useParams()
  const toast = useToast()

  const [isLoading,setIsLoading] = useState(false)

  useEffect(()=>{
      setIsLoading(true)
      api.get("customer/"+id,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
         
          setCustomer(res.data)
          setIsLoading(false)
          setIsActive(res?.data?.active)
      }).catch(err=>{
          toast({
              title: 'error',
              description: "could not load customer info",
              status: 'error',
              duration: 9000,
              isClosable: true, position:"top-left"
            })
          setIsLoading(false)
      })
  },[])

  const onHandleChnageActiveStatus= (e:React.ChangeEvent<HTMLInputElement>)=>{

    
    setIsLoading(true)
    api.put("customer/active/"+id,{
        active:e.target.checked
    },{ 
        headers: {"Authorization" : `Bearer ${token}`}
    }).then((res)=>{

       
        setCustomer(res.data)
        setIsActive(res.data?.active)
      
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

  const onHandleSubmit= ()=>{
      
      if(!!customer && customer.email != null)
          if(/\S+@\S+\.\S+/.test(customer.email) == false)
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

         

      if (customer?.firstName === ""  || customer?.email === "" || customer?.username === "" || customer?.gender === "" || customer?.birthDate == "")
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
      api.put("customer/"+id,
      customer
      ,{ 
          headers: {"Authorization" : `Bearer ${token}`}
      }).then((res)=>{
         
          setCustomer(res.data)
        
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


  return (
    <>
    <SidebarWithHeader>
         
          <Loader isLoading={isLoading}/>
          
         
          <Box  > 
            
            <Loader isLoading={isLoading} />
            <Container  maxW={'3xl'}>
            <Stack
               
                as={Box}
                
                w="100%s"
                textAlign={'center'}
                spacing={{ base: 6, md: 8 }}
                py={{ base: 10, md: 16 }}>

                <Flex >
                  <Text>active: </Text>
                  <Switch isChecked={isActive} onChange={e=>{
                      onHandleChnageActiveStatus(e)
                  }} colorScheme="pink" size={"md"} ml="2" />
                </Flex>

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
                        <Avatar name={customer?.firstName} size="2xl" fontSize={"4xl"} minW="44" minH="44" ></Avatar>
                        
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
                        defaultValue={customer?.firstName}
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        onChange={(e)=>{
                            
                            setCustomer({firstName:e.target.value,  email:customer?.email, birthDate: customer?.birthDate, gender:customer?.gender, username:customer?.username, lastName:customer?.lastName })
                        }}


                        
                        />
                         <FormHelperText></FormHelperText>
                        </FormControl>
                 
                        <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                        placeholder="Last Name"
                        defaultValue={customer?.lastName}
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        onChange={(e)=>{
                            
                            setCustomer({firstName:customer?.firstName,  email:customer?.email, birthDate: customer?.birthDate, gender:customer?.gender, username:customer?.username, lastName:e.target.value })
                        }}

                        
                        
                        />
                         <FormHelperText></FormHelperText>
                        </FormControl>

                        <FormControl isRequired>
                        <FormLabel>username</FormLabel>
                        <Input
                        placeholder="username"
                        onChange={(e)=>{
                            setCustomer({firstName:customer?.firstName,  email:customer?.email, birthDate: customer?.birthDate, gender:customer?.gender, username:e.target.value, lastName:customer?.lastName })
                        }}
                        defaultValue={customer?.username}
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
                            setCustomer({firstName:customer?.firstName,  email:customer?.email, birthDate: e.target.value , gender:customer?.gender, username:customer?.username, lastName:customer?.lastName})
                        }}
                        defaultValue={customer?.birthDate}
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
                            setCustomer({firstName:customer?.firstName,  email:customer?.email, birthDate: customer?.birthDate , gender:e.target.value, username:customer?.username, lastName:customer?.lastName})
                        }}
                        
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}

                        
                        >
                        
                        {genders.map((gender)=>(
                            <option selected={gender.abv === customer?.gender} value={gender.abv}>{gender.value}</option>
                        )
                        )}
                        </Select>
                        <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl isRequired>
                        <FormLabel>E-mail</FormLabel>
                        <Input
                        disabled
                        onChange={(e)=>{
                            setCustomer({firstName:customer?.firstName,  email:e.target.value, birthDate: customer?.birthDate , gender:customer?.gender, username:customer?.username, lastName:customer?.lastName})
                        }}
                        placeholder="firstName@lastfirstName.io"
                        bg={'gray.100'}
                        defaultValue={customer?.email}
                        border={0}
                        type='email'
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}

                        />

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
           
    </SidebarWithHeader>
    </>
  );
}