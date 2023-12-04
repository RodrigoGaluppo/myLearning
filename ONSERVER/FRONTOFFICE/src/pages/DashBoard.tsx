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
    InputRightElement,
    Input,
    InputGroup,
    Center,
    InputRightAddon, } from "@chakra-ui/react"
import ProductCard from "../components/Card"
import Header from "../components/Header"
import { useContext, useEffect, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import Loader from "../components/Loader";
import { useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";


interface IData{
    id:string
    imgUrl:string
    name:string
    subject:string;  
  
  }

export default function DashBoard(){

    const {token,user} = useAuth()

    const [courses,setCourses] = useState<IData[]>([])

    const toast = useToast()
    const [isLoading,setIsLoading] = useState(false)

    const [maxPage, setMaxPage] = useState(0)
    const  [searchParams, setSearchParams] = useSearchParams()


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

    const handleClickNext = ()=>{

        let page = Number(searchParams.get("page"))
        let search = String(searchParams.get("search"))
        
        if(page  == maxPage)
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

        if(typeof(search) === typeof("")){
            setSearchParams({
                page: (page + 1 ).toString(),
                search
             })
        }
        else{
            
             setSearchParams({
                page: (page + 1 ).toString(),
                
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
        }

        if(typeof(search) === typeof("")){
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

    useEffect(()=>{
        setIsLoading(true)
        api.get(`course/list?page=${searchParams.get("page") || 1}&search=${ searchParams.get("search") || "" }`,{ headers: {"Authorization" : `Bearer ${token}`}}).then((res)=>{
           
            setCourses(res.data?.courses)
            setMaxPage(res.data?.count)
            setIsLoading(false)
        }).catch(err=>{
            console.log(err);
            setIsLoading(false)
        })
    },[searchParams])

    return(
        <Box>
           
           <Header  />
            <Loader isLoading={isLoading} />
            <Container maxW={'5xl'}>
            <Stack
                as={Box}
                w="100%s"
                textAlign={'center'}
                spacing={{ base: 4, md: 6 }}
                py={{ base: 10, md: 16 }}>
                <Heading
                    w="100%"
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'100%'}>
                    Welcome {" "}
                    <Text  as={'span'} color={'pink.400'}>
                    {user.firstName}
                    </Text>
                </Heading>

                <Center>
                <InputGroup maxW="50rem" m="0 auto" size='md'>
                
                <Input onChange={(e)=>{

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

                <Text fontSize={{ base: 'xl', sm: 'xl', md: '2xl' }} color={'gray.500'}>
                    Here's the list of the courses you are enrolled
                </Text>
               
                </Stack>

                <SimpleGrid minChildWidth='300px' spacing={2}>
                   {
                   
                    courses?.map(course=>(
                        <ProductCard link={"/course/" + course.id}  data={course} />
                    ))

                   }
                </SimpleGrid>
                <Flex justifyContent={"space-between"}>
                <Button colorScheme="pink"  onClick={handleClickPrevious} size={"lg"}>
                    <FiArrowLeft/> Previous
                </Button>

                <Button colorScheme="pink" onClick={handleClickNext} size={"lg"}>
                    Next <FiArrowRight/>
                </Button>

                </Flex>
        </Container>
    </Box>
    )
}

