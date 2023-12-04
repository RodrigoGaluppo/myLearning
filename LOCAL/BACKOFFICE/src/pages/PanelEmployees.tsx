import { Center, Flex, Grid, GridItem,Textarea,Text, Heading, Icon,Image, SimpleGrid, useColorModeValue, Stack, Input, ButtonGroup, Button, IconButton, Box, useBreakpointValue, FormControl, useTab, useToast, useDisclosure, List, ListItem, Container, InputGroup, InputRightElement, InputRightAddon, ModalOverlay, ModalContent, FormLabel, ModalBody, ModalHeader, ModalCloseButton, ModalFooter, Modal, Checkbox, Avatar } from "@chakra-ui/react";
import { FaBan, FaBook, FaImage, FaPlay, FaTrash, FaUser } from "react-icons/fa";
import SidebarWithHeader from "../components/SideBar";
import CardModule from "../components/CardModule";
import { useEffect, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import VerifyPrompt from "../components/VerifyPrompt";
import { log } from "console";
import ModalCreateEmployee from "../components/ModalCreateEmployee";

interface IEmployee{
  id:string;
  email:string

}


export default function PanelEmployees() {
  
  const {token,user} = useAuth()
  const [isLoading,setIsLoading] = useState(false)

  const toast = useToast()

  const width100whenMobile = useBreakpointValue({
    sm:"100%",
    md:"",
    lg:"",
    base:"100%"
  })

  const MtWhenMobile = useBreakpointValue({
    sm:"4",
    md:"",
    lg:"",
    base:"4"
  })

  const [employees, SetEmployees] = useState<IEmployee[]>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const  [searchParams, setSearchParams] = useSearchParams()

  const [maxPage, setMaxPage] = useState(0)

  const [isDeletingEnable,setIsDeletingEnable] = useState(false)
  const verifyPrompt = useDisclosure()


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

  const onHanldeDeleteemployee = (employeeId:string)=>{

    setIsLoading(true)

    api.delete(`${employeeId}`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
      
      const newTextemployees = employees?.filter(
        txtL=>(txtL.id != employeeId)
      )

      toast({
        title: 'employee deleted permanenlty',
        description: "",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })

      SetEmployees(newTextemployees)

      setIsLoading(false)
      
    }).catch(err=>{

      toast({
        title: 'Could not delete employee ',
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
    api.get(`list?page=${ searchParams.get("page") || 1}&search=${ searchParams.get("search") || "" }`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
       
      SetEmployees(res?.data?.employees);
            
      setMaxPage(res?.data?.count)
     
      setIsLoading(false)
  }).catch(err=>{
  
      setIsLoading(false)

      toast({
        title: 'Could not load employees',
        description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
  })

  },[searchParams])

  const handleClickNext = ()=>{

    let page = Number(searchParams.get("page"))
    let search = String(searchParams.get("search"))
    
   
    if(page  >= maxPage)
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
          <ModalCreateEmployee isOpen={isOpen} onClose={()=>{
            onClose()
            setSearchParams({
              page:String(searchParams.get("page")),
              search:String(searchParams.get("search"))
            })
          }} />
          <Loader isLoading={isLoading}/>
              
          <VerifyPrompt onClose={verifyPrompt.onClose} onOpen={verifyPrompt.onOpen} isOpen={verifyPrompt.isOpen} >
            <Button color={"red.400"} onClick={verifyPrompt.onClose} >Ok</Button>          
          </VerifyPrompt>
          
          <Container maxW="3xl" >
         
        <Heading textAlign={"center"} w="100%">
          Employees
        </Heading>
        <Flex w="100%" mt="4" flexWrap={"wrap"} justifyContent={"space-between"}  >
        <Button w={width100whenMobile} onClick={onOpen} colorScheme="pink" >Create a Employee</Button>
        
        <Box  w={width100whenMobile} mt={MtWhenMobile}>
        <InputGroup w="100%">
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
        <Checkbox mt="4" onChange={(e)=>{
              setIsDeletingEnable(e.target.checked)

              if(e.target.checked){
                verifyPrompt.onOpen()
              }

            }}>
              Enable Delete
            </Checkbox>
        </Box>
        
      </Flex>
           <List mt="4"  w="100%" mb="4" pb="4" spacing={3} maxH="400px" overflowX={"auto"} overflowY={"auto"} >
                 
                 {

                   employees?.map(employee=>(
                    <ListItem minW="100%" flexWrap={"wrap"} key={employee.id} bg={"gray.700"} display="flex" alignItems={"center"} borderRadius={"xl"}  px="4" py="6"  >
                    <Flex  flexWrap={"wrap"}  w="100%" alignItems={"center"} justifyContent={"space-between"}>
                      <Link  style={{width:width100whenMobile,height:"100%"}} to={`/employee/${employee.id}`}>       
                        <Flex w={width100whenMobile}  flexWrap={"nowrap"} alignItems={"center"}>
                          <Box maxW="20">
                                  <Avatar name={employee.email}></Avatar>
                          </Box>
                          <Text  pl="4" fontSize={"large"}>{employee.email}  </Text> 
                        </Flex>
                      </Link>  
                      {
                      
                      employee.id !== user.id ? 
                      <Button ml="2" mt={MtWhenMobile} onClick={()=>{
                        onHanldeDeleteemployee(employee.id)
                      }} display={"flex"} p="4" alignItems={"center"} disabled={!isDeletingEnable} size="lg" justifyContent={"space-between"} bg="red.400">
                        
                        Delete 
                        
                        <Icon ml="2"><FaTrash></FaTrash></Icon>
                      </Button>
                      :
                      <Button ml="2" mt={MtWhenMobile} display={"flex"} p="4" alignItems={"center"} disabled size="lg" justifyContent={"space-between"} bg="red.300">
                        <Icon ml="2"><FaBan/></Icon>
                      </Button>
                      
                      
                      } 
                    </Flex>       
                    </ListItem>
                   ))
                 }
                 
                 {employees?.length == 0 && <Text mt="4" textAlign={"center"} fontSize={"md"}>There are no employees</Text>}
                 
                     
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