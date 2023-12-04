import { Center, Heading, Icon, SimpleGrid, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
import { FaBook, FaPlay, FaUser } from "react-icons/fa";
import { useRouteError } from "react-router-dom";


export default function PanelGrid() {
  const error:any = useRouteError();
  console.error(error);

  return (
    
      <SimpleGrid minChildWidth='300px' spacing={4}>
        <Center 
          bg={useColorModeValue("pink.200","gray.900")}
          p="4" py="10" 
        >
          
          <StatGroup  >
            <Stat w="100%" >
                <StatLabel fontSize={"3xl"} >Alunos 499 <Icon as={FaUser} ml="2" fontSize={"2xl"} /> 
                </StatLabel>
                
                <StatHelpText>
                <StatArrow type="increase" />
                10%
                </StatHelpText>
            </Stat>
            </StatGroup>
          
        </Center>
        <Center 
          bg={useColorModeValue("pink.200","gray.900")}
          p="4" py="10"
        >
          <Heading fontSize={"3xl"} >3 Cursos</Heading>
          <Icon as={FaBook} ml="2" fontSize={"2xl"} /> 
          
        </Center>
        <Center 
          bg={useColorModeValue("pink.200","gray.900")}
          p="4" py="6"
        >
            
            <Heading fontSize={"3xl"} >500 Aulas </Heading>
            <Icon as={FaPlay} ml="2" fontSize={"2xl"} /> 
          
        </Center>

        
        
      </SimpleGrid>
    
  );
}