import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,Text } from "@chakra-ui/react";
import { ReactNode, useRef } from "react";


const VerifyPrompt:React.FC<{isOpen:boolean; onOpen:()=>void, onClose:()=>void, children:ReactNode}> = ({isOpen,onOpen,onClose,children})=>{

    const btnRef = useRef<HTMLButtonElement>(null)

    return (
        <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={btnRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader> Proceed action?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text my="2">
              Are you sure you want to proceed this action?
            </Text>
            {children}
          </AlertDialogBody>
          <AlertDialogFooter>
           <Button colorScheme="pink" onClick={onClose} >Cancel</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      
      </AlertDialog>
    )
}

export default VerifyPrompt