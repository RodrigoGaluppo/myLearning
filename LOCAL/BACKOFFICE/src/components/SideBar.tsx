import React, { ReactNode } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  Image,
  MenuList,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { FaBook, FaLine, FaPersonBooth, FaUser } from 'react-icons/fa';

import { useAuth } from '../hooks/AuthContext';

interface LinkItemProps {
  name: string;
  icon: IconType;
  link:string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiTrendingUp, link:"/panel/" },
  { name: 'Subjects', icon:FaBook, link:"/Subjects/" },
  { name: 'Customers', icon:FaBook, link:"/Customers/" },

];

const LinkItemsAdmin: Array<LinkItemProps> = [
  { name: 'Home', icon: FiTrendingUp, link:"/panel/" },
  { name: 'Subjects', icon:FaBook, link:"/Subjects/" },
  { name: 'Customers', icon:FaUser, link:"/Customers/" },
  { name: 'Employees', icon:FaPersonBooth, link:"/Employees/" },

];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

  const {user} =useAuth()


  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Box w="100%" >
            <Link to="/" >
            <Image w="100%" maxH={"80px"} objectFit={"contain"} src={useColorModeValue('/Images/logo-white.svg', '/Images/logo-dark.svg')}/>
            </Link>
            
        </Box>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      { user.employeeRole == "Admin" ? 
      LinkItemsAdmin.map((link) => (
        <Link to={link.link} >
          <NavItem key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        </Link> 
        ))
        :
        LinkItems.map((link) => (
          <Link to={link.link} >
            <NavItem key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          </Link> 
        ))
      }

    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText | ReactNode;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    
      <Flex
        _focus={{ boxShadow: 'none' }}
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const {user,signOut} =useAuth()

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  name={user.name}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{user.email}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user.employeeRole}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              
              <MenuItem onClick={()=>{signOut()}}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};