import {v4} from "uuid"
import {tokenModel,IToken} from "./db"

export default {

    // method to create token 
    createToken:async (customerId:string)=>{
  
       
        const tokenId= v4()

        tokenModel.create({
            tokenId,
            customerId
        })



        return tokenId

    },
  
    // method to verify wether or not token is valid
    isTokenValid: async (tokenId: string) => {
 

        const token = await tokenModel.findOne({
            tokenId:tokenId
        })

        if (!!token) {
      
        const tokenTimestamp = token.timeStamp;

/*
        // calculate the current timestamp and check if it is less than 15 minutes ago
        const currentTimestamp = Date.now();
        const fifteenMinutesInMilliseconds = 15 * 60 * 1000; // 15 minutes in milliseconds
        const fifteenMinutesAgo = currentTimestamp - fifteenMinutesInMilliseconds;
*/
        // verify wether token has been issued in more than 15 minutes or it has been used
        //return tokenTimestamp > fifteenMinutesAgo && token.used == false; 

        return token.used == false; 
      }

      return false; // token not found so invalid
        
    },

    setTokenUsed: async (tokenId: string) => {
 

        const token = await tokenModel.findOneAndDelete({
            tokenId:tokenId
        },{ $set: { used: true } 
        })

        return token; // token not found so invalid
        
    },
  
    // method to retrieve customer by token
    getCustomerIdByTokenId: async (tokenId: string) => {
  

        const result = await tokenModel.findOne({
            tokenId:tokenId
        })
        
        return result?.customerId // token not found so invalid

      
    },
  

  
  }
  