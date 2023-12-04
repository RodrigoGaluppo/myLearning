import {
    Flex,    
    Modal,
    ModalOverlay,
    ModalContent,
    Spinner,
  } from '@chakra-ui/react';

  
interface ILoaderProps{
    isLoading:boolean
}

export default function Loader({isLoading}:ILoaderProps){

    return(
     
        <Modal closeOnOverlayClick={false} isOpen={isLoading} onClose={()=>{}}>
            <ModalOverlay />
            <ModalContent height={"32"} w="100%" bg="transparent" onFocus={(e)=>{e.target.style.border = "0px"}} border={"0"}>
                <Flex justifyContent={"center"}>
                    <Spinner color="pink.500" width={"28"} height={"28"} ></Spinner>
                </Flex>
            </ModalContent>
        </Modal>
        
    )
}