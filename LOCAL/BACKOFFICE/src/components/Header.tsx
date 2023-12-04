import { ReactNode, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Container,
  Image,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as LinkRoute } from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/AuthContext';

interface ILink{
  title:string
  value:string
}



const NavLink = ({ children, href="#" }: { children: ReactNode, href:string }) => (

  <Link
    w="100%"
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}
    >
    <Text w="100%">{children}</Text>
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {setColorMode } = useColorMode()
  const {signOut,user} = useAuth()

  useEffect(()=>{
    setColorMode("dark")
  },[])

  return (
    <>
      <Box bg={useColorModeValue('gray.50', 'gray.800')}  px={4}>
        <Container width="100%" maxW="5xl" m="0 auto" >
        <Flex  h={20}  alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
          
          <HStack spacing={8} alignItems={'center'}>
            <Box w="100%" >
                  <LinkRoute to={
                    !!user ? "/panel": "/"
                  } >
                  <Image w="100%" maxH={"80px"} objectFit={"contain"} src={useColorModeValue('../Images/logo-white.svg', '../Images/logo-dark.svg')}/>
                  </LinkRoute>
            </Box>
            <HStack
              as={'nav'}
              spacing={6}
              width={"100%"}
              display={{ base: 'none', md: 'flex' }}>
              
              <NavLink href={`/courses`} >
                  Courses List
              </NavLink>
           
              {
                !!user && <NavLink href={`/dashboard`} >
                    My Courses
                  </NavLink>
              }

            </HStack>
           
          </HStack>
          
          <Flex alignItems={'center'}>
            <ColorModeSwitcher mr="2"></ColorModeSwitcher>
            
            {

              !!user  &&
              <Menu>

              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  name={`${user.name}`}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>
                <HStack spacing={"2"}>
                    <FiUser/>
                    <LinkRoute to="/profile">Profile</LinkRoute>
                  </HStack> 
                </MenuItem>
                <MenuItem>
                <HStack spacing={"2"}>
                    <FiSettings/>
                    <Text>Settings</Text>
                  </HStack> 
                </MenuItem>
                <MenuDivider />
                <MenuItem
                onClick={()=>{
                  signOut()
                }}
                > 
                <HStack spacing={"2"}>
                    <FiLogOut/>
                    <Text>SignOut</Text>
                  </HStack> </MenuItem>
              </MenuList>
            </Menu>
          


            }
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink href={`/courses`} >
                  Courses List
              </NavLink>
           
              {
                !!user && <NavLink href={`/dashboard`} >
                    My Courses
                  </NavLink>
              }
            </Stack>
          </Box>
        ) }
        
        </Container>
      </Box>

    </>
  );
}