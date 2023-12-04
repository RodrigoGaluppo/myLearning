import * as React from "react"
import AppProvider from "./hooks"

import {
  ChakraProvider,
  ColorModeProvider
} from "@chakra-ui/react"

import { extendTheme } from '@chakra-ui/react'
import Router from "./routes/Router"


// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })


export const App = () => (
  <AppProvider>
     <ChakraProvider  theme={theme}>
    
      <Router></Router>
     
     
    </ChakraProvider>
  </AppProvider>
 
)
