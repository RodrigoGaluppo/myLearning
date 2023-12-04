import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
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
          <AlertDialogHeader> Delete Item?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this item?
            (All items related to this one will be deleted as well)
            `
          </AlertDialogBody>
          <AlertDialogFooter>
            {children}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}

export default VerifyPrompt