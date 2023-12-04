import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
  } from '@chakra-ui/react';
  import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
  import { FiBook, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
  
  interface IData{
   
    id:string
    imgUrl:string
    name:string
    subject:string;  
  
  }

 

  /*
  interface RatingProps {
    rating: number;
    numReviews: number;
  }
  
  function Rating({ rating, numReviews }: RatingProps) {
    return (
      <Box display="flex" alignItems="center">
        {Array(5)
          .fill('')
          .map((_, i) => {
            const roundedRating = Math.round(rating * 2) / 2;
            if (roundedRating - i >= 1) {
              return (
                <BsStarFill
                  key={i}
                  style={{ marginLeft: '1' }}
                  color={i < rating ? 'teal.500' : 'gray.300'}
                />
              );
            }
            if (roundedRating - i === 0.5) {
              return <BsStarHalf key={i} style={{ marginLeft: '1' }} />;
            }
            return <BsStar key={i} style={{ marginLeft: '1' }} />;
          })}
        
      </Box>
    );
  }*/
  
  function ProductCard({data, link}:{data:IData, link:string}) {
    const {user} = useAuth()
    return (
      <Flex  p={4} pt="-0.5" w="full" alignItems="center" justifyContent="center">
        <Box
          bg={useColorModeValue('gray.50', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">

        <Link to={link} >

            
          <Image
            src={data.imgUrl}
            alt={`Picture of ${data.name}`}
            roundedTop="lg"
          />
  
          <Box p="4">
            <Box display="flex" alignItems="baseline">
              
                <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                  {data.subject}
                </Badge>
             
            </Box>
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {data.name}
              </Box>
              <Icon as={FiBook} h={7} w={7} ml="2" alignSelf={'center'} />
            </Flex>
  
            <Flex justifyContent="space-between" mt="1" alignContent="center">
              
             
            </Flex>
          </Box>
          </Link>
        </Box>
      </Flex>
    );
  }
  
  export default ProductCard;