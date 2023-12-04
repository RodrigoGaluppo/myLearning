import { Center, Flex, Grid, GridItem, Heading, Icon, SimpleGrid, useColorModeValue,Text, Box } from "@chakra-ui/react";
import { FaBook, FaPlay, FaUser } from "react-icons/fa";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import PanelGrid from "../components/PanelGrid";
import SidebarWithHeader from "../components/SideBar";
import { useEffect, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../hooks/AuthContext";
import BarChart from "../components/BarChart";


export default function Panel() {
 
  const {token,user} = useAuth()
  const [isActive, setIsActive] = useState(false)

  const [dataGenderCount,setDataGenderCount] = useState<number[]>([])

  const [accomplishedLessonsCOunt,setAccomplishedLessonsCOunt] = useState<number[]>([])

  const [studentsCount,setStudentsCount] = useState<number>(0)
  const [lessonsCount,setLessonsCount] = useState<number>(0)
  const [coursesCount,setCoursesCount] = useState<number>(0)

  const [accomplishedLessonsCOuntByHour,setAccomplishedLessonsCOuntByHour] = useState<number[]>([])

  const [employeeRoles,setEmployeeRoles] = useState<string[]>([])
  const [employeeRolesPercentage,setEmployeeRolesPercentage] = useState<number[]>([])

  const [topCourses,setTopCourses] = useState<string[]>([])
  const [topCoursesCount,setTopCoursesCount] = useState<number[]>([])

  const [dataEmployeeGenderCount,setDataEmployeeGenderCount] = useState<number[]>([])

  const Months = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
     "October",
     "November",
     "December"
  ];

  const Hours = [
    "0","1","2","3","4","5","6","7","8","9","10","11","12",
    "13","14","15","16","17","18","19","20","21","22","23"
   ];
 

  useEffect(()=>{

    api.get("panel",{ headers: {"Authorization" : `Bearer ${token}`}})
    .then((res)=>{

      setDataGenderCount(res.data?.genderPercentages?.map((f:any)=>{
        return f?.percentage
      }))

      setDataEmployeeGenderCount(res.data?.genderPercentagesEmployees?.map((f:any)=>{
        return f?.percentage
      }))

      setAccomplishedLessonsCOunt(Object.values(res.data?.accomplishedLessonsByMonth))

      setAccomplishedLessonsCOuntByHour(Object.values(res.data?.accomplishedLessonsByHour))

      setEmployeeRoles(res.data?.rolePercentageEmployee?.map((item:any) => item.role))
      setEmployeeRolesPercentage(res.data?.rolePercentageEmployee?.map((item:any) => item.percentage))

      setLessonsCount(res.data?.lessonsCount)
      setStudentsCount(res.data?.customersCount)
      setCoursesCount(res.data?.coursesCount)

      setTopCourses(res.data?.topCourses?.map((item:any) => item.courseName))
      setTopCoursesCount(res.data?.topCourses?.map((item:any) => item.enrollmentCount))
      
    })
    .catch(()=>{

    })

  },[])

  return (
    <>
    <SidebarWithHeader>
      <PanelGrid
      classesCount={lessonsCount}
      coursesCount={coursesCount}
      studentsCount={studentsCount}
      />
      <SimpleGrid color="white" my="10" columns={1} spacing="6" >

      {
        user.employeeRole.toLowerCase() == "admin" && 
        (

          <Flex flexWrap={"wrap"}>
      <Heading w="100%" textAlign={"center"}>Employees Statistics</Heading>
      <Center w={{"sm":"100%","md":"50%","lg":"50%"}} my="10" flexWrap={"wrap"} maxH="400px" >
          <Text mb="2" textAlign={"center"} w="100%">Employee Genders</Text>
          <PieChart
            label={["M","F","O"]}
            data={dataEmployeeGenderCount}
          />
        </Center >

        <Center w={{"sm":"100%","md":"50%","lg":"50%"}} my="10"  flexWrap={"wrap"} maxH="400px" >
          <Text mb="2" textAlign={"center"} w="100%">Employee Roles</Text>
          <PieChart
            label={employeeRoles}
            data={employeeRolesPercentage}
          />
        </Center>
      </Flex>
        )
      }
      
      
      <Flex flexWrap={"wrap"}>
      <Heading w="100%" textAlign={"center"}>Customer and Course Statistics</Heading>
      <Center w={{"sm":"100%","md":"50%","lg":"50%"}} my="5"  flexWrap={"wrap"} >
        <Text mb="2" textAlign={"center"} w="100%">Accomplished Lessons by hour of the day</Text>
          <LineChart
            labels={Hours}
            data={accomplishedLessonsCOuntByHour}
          />
        </Center>
        <Center w={{"sm":"100%","md":"50%","lg":"50%"}} my="5"  flexWrap={"wrap"} >
        <Text mb="2" textAlign={"center"} w="100%">Accomplished Lessons by month of the year</Text>
        <LineChart
          
          labels={Months}
          data={accomplishedLessonsCOunt}
        />
        </Center>

        <Center w={{"sm":"100%","md":"50%","lg":"50%"}} flexWrap={"wrap"} maxH="400px" my="5" >
          <Text mb="2" textAlign={"center"} w="100%">Customer Genders</Text>
          <PieChart
            label={["M","F","O"]} 
            data={dataGenderCount}
          />
        </Center>

        <Center w={{"sm":"100%","md":"50%","lg":"50%"}} flexWrap={"wrap"} maxH="400px" my="5" >
          <Text mb="2" textAlign={"center"} w="100%">Top 5 courses by subscriptions</Text>
          <BarChart
            labels={topCourses}
            data={topCoursesCount}
          />
        </Center>
      </Flex>

      </SimpleGrid>
    </SidebarWithHeader>
    </>
  );
}