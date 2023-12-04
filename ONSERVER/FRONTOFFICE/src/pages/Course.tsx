import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Center,
  ListItem,
  ListIcon,
  List,
  Collapse,
  Spinner,
  useToast,
  Progress,
  Box,
  Button,
  useDisclosure
} from '@chakra-ui/react';

import {  useEffect, useState } from 'react';
import { FiBook,  FiPlay } from 'react-icons/fi';
import Header from '../components/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/apiClient';
import { useAuth } from '../hooks/AuthContext';
import Loader from '../components/Loader';
import Feature from '../components/Feature';
import VerifyPrompt from '../components/VerifyPrompt';


interface ICourse {
  id: string
  imgUrl: string
  name: string
  description: string
  subject: string;
  chapters: IChapter[]
  lessonsCount:number
  accomplishedLessonsCount:number
  customerCourseId:number

}

interface IChapter {
  id:string
  title: string
  lessons: ILesson[]
}

interface ILesson {
  id: string;
  title: string
}


export default function Course() {

  const [course, setCourse] = useState<ICourse>()
  const [chapterToShow,setChapterToShow] = useState<IChapter>()
  const { id } = useParams() // course id from route
  const { token } = useAuth()

  const chapterItembg = useColorModeValue("gray.200", "gray.900") // bg based on dark or light mode
  const lessonItemBg = useColorModeValue("gray.300", "gray.800")

  const [isLoadingChapter, setIsLoadingChapter] = useState(false) // control if chapter loader is active
  const [clickedChapterIndex, setClickedChapterIndex] = useState(-1) // control ehich chapter is clicked
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null) // control which chapter had been activated

  const [accomplishedCount,setAccomplishedCount] = useState(0) // the accomplished lessons count
  const [lessonsCount,setLessonsCount] = useState(0) // the lessons count


  const [isLoading,setIsLoading] = useState(false)

  const {isOpen, onClose, onOpen} = useDisclosure()


  const navigate = useNavigate()
            
  const toast = useToast()

  const handleGetCertificate = ()=>{
    setIsLoading(true)
  
    var windowReference = window;

    api.post("certificate/", {
      customercourseId:course?.customerCourseId
    },{ headers: { "Authorization": `Bearer ${token}` } })
    .then((res) => {
        
      setIsLoading(false)
      windowReference?.location.replace(res.data?.url) 
 
    
    }).catch(err => {
      
      setIsLoading(false)
      toast({
        title: 'Could not generate certificate',
        description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
    })

  }

  const handleDelist = ()=>{
    setIsLoading(true)


    api.delete("course/"+id,{ headers: { "Authorization": `Bearer ${token}` } })
    .then((res) => {
        
      setIsLoading(false)

      navigate("/dashboard")
    }).catch(err => {
      
      setIsLoading(false)

      toast({
        title: 'Could not delist to course',
        description: "",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      })
    })

  }

  const handleChapterClick = (index: number, chapterId:string) => {

    if(clickedChapterIndex === index && isLoadingChapter) // if same chapter had been clicked already do nothing
      return

    if(index !== activeChapterIndex) // if diff index open dropdown and send request
    {
      setIsLoadingChapter(true)
      setClickedChapterIndex(index)
      api.get(`chapter/${chapterId}?courseId=${id}`,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then((res)=>{
        setIsLoadingChapter(false)
        setClickedChapterIndex(-1)
        setActiveChapterIndex(prevIndex => (prevIndex === index ? null : index));
        
        if(res.data != null)
         setChapterToShow(res.data)

      })
      .catch(()=>{
        setIsLoadingChapter(false)
        setActiveChapterIndex(prevIndex => (prevIndex === index ? null : index));
        toast({
          title: 'Could not load chapters',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
      })
    }
    
   
  };

  

  useEffect(() => {
    setIsLoading(true)
    api.get("course/" + id, { headers: { "Authorization": `Bearer ${token}` } })
      .then((res) => {
        
        
        setCourse(res.data)
        setIsLoading(false)

        setLessonsCount(res.data.lessonsCount)
     
        
        setAccomplishedCount(Math.ceil(res.data.accomplishedLessonsCount * 100))        
        
      }).catch(err => {
        console.log(err);
        setIsLoading(false)
        toast({
          title: 'Could not load course',
          description: "",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"top-left"
        })
      })

  }, [])


  return (
    <>
      
      <Header  />
       <Loader isLoading={isLoading} />
       <VerifyPrompt
            isOpen={isOpen} onClose={onClose} onOpen={onOpen}
            >
                <Text>If you delist your course you may lose data of what you have accomplished with it</Text>
                <Button mt="2" bg={"red.400"} onClick={handleDelist} >Proceed</Button>
        </VerifyPrompt>
        
      <Container maxW={'5xl'} py={10}>
        <Box mb="12">
        <Progress mb="2" colorScheme="green" value={accomplishedCount}/> 
        <Flex justifyContent={"space-between"}>

        {accomplishedCount === 100 && <Button onClick={handleGetCertificate} mt="4" size="sm" h="12" colorScheme='green' justifySelf={"center"}>Get certificate</Button>}

        <Feature  icon={<FiBook/>} iconBg='green.300' text={`${
          isNaN(accomplishedCount) ? 0 : accomplishedCount 
        }%`}></Feature>

        </Flex>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          
          <Stack spacing={4}>
           
            <Text
              textTransform={'uppercase'}

              fontWeight={600}
              fontSize={'sm'}
              color={useColorModeValue('pink.400', 'pink.400')}
          
              alignSelf={'flex-start'}
              rounded={'md'}>
              {course?.subject}
            </Text>

            
            <Heading>  {course?.name}</Heading>
            <Text color={'gray.500'} fontSize={'lg'}>
              {course?.description}
            </Text>
            <Flex w="100%" justifyContent={"space-between"}>
              <Link to={`/forum/${course?.id}`}>
              <Button  colorScheme='pink' >Go to Forum</Button>
              
              </Link>
              <Button maxW="50%" onClick={()=>{
                  onOpen()
              }} color='red.400' >Withdraw course</Button>
            </Flex>
            

          </Stack>
          <Flex>
            <Image
              rounded={'md'}
              alt={'feature image'}
              fallbackSrc='../Images/formulas-dark.svg'
              src={
                course?.imgUrl
              }
              objectFit={'cover'}
            />
          </Flex>
        </SimpleGrid>
        <Heading my="10"  >
          <Center>Chapters </Center>
        </Heading>
        <Flex
          w="100%"
        >

          <List w="100%" mb="4" pb="4" spacing={3} maxH="300px" overflowY={"auto"} >
            {
              course?.chapters.map((chapter, index) => (

                <ListItem  key={index} onClick={(e) => handleChapterClick(index,chapter.id)} px="4" py="6" bg={chapterItembg} >
                
                  {
                    clickedChapterIndex === index && isLoadingChapter ? 
                    <Spinner color='green.500' mr="2" />
                    :
                    <ListIcon as={FiBook} color='pink.500' />
                  }

    
                  {chapter.title}

                  <Collapse in={activeChapterIndex === index}>
                    <List w="100%" my="4" spacing={3} maxH="300px" overflowY={"auto"} >
                    
                      {chapterToShow?.lessons.map(lesson=>(
                        <ListItem key={lesson.id} px="4" py="4" bg={lessonItemBg} >
                        <ListIcon as={FiPlay} color='pink.500' />
                          <Link to={`/lesson/${lesson.id}?courseId=${id}`}>
                          {lesson.title}
                          </Link>
                        </ListItem>
                      ))}

                    </List>
                  </Collapse>

                </ListItem>

              ))
            }


          </List>

         
        </Flex>
        {course?.chapters?.length == 0 && <Text w="100%" mt="-4" textAlign={"center"}>There are no chapters</Text>}
      </Container>

    </>

  );
}