import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";


export default function ErrorPage() {
  const error:any = useRouteError();
  console.error(error);

  return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Página inexistente</AlertDescription>
    </Alert>
  );
}