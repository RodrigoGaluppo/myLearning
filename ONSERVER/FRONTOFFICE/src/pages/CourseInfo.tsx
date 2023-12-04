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
  Button
} from '@chakra-ui/react';

import {  useEffect, useState } from 'react';
import { FiBook,  FiPlay } from 'react-icons/fi';
import Header from '../components/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/apiAnonymous';
import apiLogged from '../services/apiClient';
import { useAuth } from '../hooks/AuthContext';
import Loader from '../components/Loader';
import Feature from '../components/Feature';


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


export default function CourseInfo() {

  const [course, setCourse] = useState<ICourse>()
  const [chapterToShow,setChapterToShow] = useState<IChapter>()
  const { id } = useParams() // course id from route
  const { token,user } = useAuth()

  const chapterItembg = useColorModeValue("gray.200", "gray.900") // bg based on dark or light mode
  const lessonItemBg = useColorModeValue("gray.300", "gray.800")

  const [isLoadingChapter, setIsLoadingChapter] = useState(false) // control if chapter loader is active
  const [clickedChapterIndex, setClickedChapterIndex] = useState(-1) // control ehich chapter is clicked
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null) // control which chapter had been activated

  const [accomplishedCount,setAccomplishedCount] = useState(1) // the accomplished lessons count
  const [lessonsCount,setLessonsCount] = useState(1) // the lessons count

  const navigate = useNavigate()

  const [isLoading,setIsLoading] = useState(false)

  const toast = useToast()

  const handleEnroll = ()=>{
    setIsLoading(true)

    if(!user){
      return navigate("/")
    }

    apiLogged.post("course/", {
      courseId:id
    },{ headers: { "Authorization": `Bearer ${token}` } })
    .then((res) => {
        
      setIsLoading(false)

      navigate("/course/"+id)
    }).catch(err => {
      
      setIsLoading(false)

      toast({
        title: 'Could not enroll to course',
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
    api.get("course/" + id)
      .then((res) => {
        
        
        setCourse(res.data)
        setIsLoading(false)

        setLessonsCount(res.data.lessonsCount)
        setAccomplishedCount(res.data.accomplishedLessonsCount)        
        
      }).catch(err => {
        console.log(err);
        setIsLoading(false)
        toast({
          title: 'Could not load course info',
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
      <Container maxW={'5xl'} py={10}>
        
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
              {course?.description && ""}
            </Text>

            {!!user && 
            
            <Button onClick={handleEnroll} maxW="50%" colorScheme='green' >Enroll Me</Button>
            
            }

            {!user && 
            
            <Text>Login to roll yourself and watch lessons</Text>
            
            }

          </Stack>
          <Flex>
            <Image
              rounded={'md'}
              fallbackSrc='../Images/formulas-dark.svg'
              alt={'feature image'}
              src={
                course?.imgUrl}
              objectFit={'cover'}
            />
          </Flex>
        </SimpleGrid>
        <Heading my="10"  >
          <Center>Modules </Center>
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

    
                  {chapter?.title}

                  <Collapse in={activeChapterIndex === index}>
                    <List w="100%" my="4" spacing={3} maxH="300px" overflowY={"auto"} >
                    
                      {chapterToShow?.lessons.map(lesson=>(
                        <ListItem key={lesson.id} px="4" py="4" bg={lessonItemBg} >
                        <ListIcon as={FiPlay} color='pink.500' />
                          
                          {lesson.title}
                         
                        </ListItem>
                      ))}

                    </List>
                  </Collapse>

                </ListItem>

              ))
            }


          </List>

     
        </Flex>
        <Text w="100%" mt="-4" textAlign={"center"}>
            {course?.chapters?.length == 0 && "There are no Chapters"}
          </Text>
      </Container>

    </>

  );
}