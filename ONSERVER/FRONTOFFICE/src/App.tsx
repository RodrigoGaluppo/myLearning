import * as React from "react"
import AppProvider from "./hooks"

import {
  ChakraProvider,
  theme
} from "@chakra-ui/react"

import {RouterProvider} from "react-router-dom"

import Router from "./routes/Router"

export const App = () => (
  <AppProvider>
     <ChakraProvider  theme={theme}>
     <Router></Router>
    </ChakraProvider>
  </AppProvider>
 
)
