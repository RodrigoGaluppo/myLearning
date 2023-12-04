import { Center, Flex, Grid, GridItem,Textarea,Text, Heading, Icon,Image, SimpleGrid, useColorModeValue, Stack, Input, ButtonGroup, Button, IconButton, Box, useBreakpointValue, FormControl, useTab, useToast, useDisclosure, List, ListItem, Container, InputGroup, InputRightElement, InputRightAddon, ModalOverlay, ModalContent, FormLabel, ModalBody, ModalHeader, ModalCloseButton, ModalFooter, Modal, VStack, Checkbox, Avatar, FormHelperText, Select } from "@chakra-ui/react";
import SidebarWithHeader from "../components/SideBar";
import { LegacyRef, useEffect, useRef, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Switch } from '@chakra-ui/react'




interface IEmployee{
  name:string | undefined;
  employeeRole:string | undefined;
  email:string | undefined;

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


export default function PanelEmployee() {
  
  const {token,user} = useAuth()

  const [employee, setEmployee] = useState<IEmployee>()
  const [isActive, setIsActive] = useState(false)
  const {id} = useParams()
  const toast = useToast()

  const [isLoading,setIsLoading] = useState(false)

  useEffect(()=>{
      setIsLoading(true)
      api.get(""+id,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
         
          setEmployee(res.data)
          setIsLoading(false)
          setIsActive(res?.data?.active)
      }).catch(err=>{
          toast({
              title: 'error',
              description: "could not load employee info",
              status: 'error',
              duration: 9000,
              isClosable: true, position:"top-left"
            })
          setIsLoading(false)
      })
  },[])

 

  const onHandleSubmit= ()=>{
      
      if(!!employee && employee.email != null)
          if(/\S+@\S+\.\S+/.test(employee.email) == false)
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

         

      if (employee?.name === ""  || employee?.email === "" || employee?.gender === "" || employee?.birthDate == "")
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
      api.put(""+id,
      employee
      ,{ 
          headers: {"Authorization" : `Bearer ${token}`}
      }).then((res)=>{
         
          setEmployee(res.data)
        
          toast({
              title: 'success',
              description: "employee was successfully updated",
              status: 'success',
              duration: 9000,
              isClosable: true, position:"top-left"
            })
           
          setIsLoading(false)
      }).catch(err=>{
          toast({
              title: 'error',
              description: "could not update employee info",
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
                        <Avatar name={employee?.name} size="2xl" fontSize={"4xl"} minW="44" minH="44" ></Avatar>
                        
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
                        defaultValue={employee?.name}
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        onChange={(e)=>{
                            
                            setEmployee({name:e.target.value,  email:employee?.email, birthDate: employee?.birthDate, gender:employee?.gender, employeeRole:employee?.employeeRole })
                        }}


                        
                        />
                         <FormHelperText></FormHelperText>
                        </FormControl>
                 
                        <FormControl isRequired>
                        <FormLabel>Role</FormLabel>
                        <Select
                     
                        defaultValue={employee?.employeeRole}
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}
                        onChange={(e)=>{
                            
                            setEmployee({name:employee?.name,  email:employee?.email, birthDate: employee?.birthDate, gender:employee?.gender, employeeRole:e.target.value })
                        }}

                        
                        
                        >
                            <option value={"Admin"} selected={employee?.employeeRole == "Admin"} >Admin</option>
                            <option value={"Manager"} selected={employee?.employeeRole == "Manager"} >Manager</option>
                        </Select>
                         <FormHelperText></FormHelperText>
                        </FormControl>

                        
              
                        <FormControl isRequired>
                        <FormLabel>Birthdate</FormLabel>
                        <Input
                        
                        bg={'gray.100'}
                        border={0}
                        type='date'
                        onChange={(e)=>{
                            setEmployee({name:employee?.name,  email:employee?.email, birthDate: e.target.value , gender:employee?.gender, employeeRole:employee?.employeeRole})
                        }}
                        defaultValue={employee?.birthDate}
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
                            setEmployee({name:employee?.name,  email:employee?.email, birthDate: employee?.birthDate , gender:e.target.value, employeeRole:employee?.employeeRole})
                        }}
                        
                        bg={'gray.100'}
                        border={0}
                        color={'gray.900'}
                        _placeholder={{
                            color: 'gray.500',
                        }}

                        
                        >
                        
                        {genders.map((gender)=>(
                            <option selected={gender.abv === employee?.gender} value={gender.abv}>{gender.value}</option>
                        )
                        )}
                        </Select>
                        <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl isRequired>
                        <FormLabel>E-mail</FormLabel>
                        <Input
                        disabled={employee?.email == user.email}
                        onChange={(e)=>{
                            setEmployee({name:employee?.name,  email:e.target.value, birthDate: employee?.birthDate , gender:employee?.gender, employeeRole:employee?.employeeRole})
                        }}
                        placeholder="name@employeeRole.io"
                        bg={'gray.100'}
                        defaultValue={employee?.email}
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