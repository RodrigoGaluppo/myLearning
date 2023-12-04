import { BlobServiceClient } from "@azure/storage-blob";
import path from "path"
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) // get env variables

// service to save blob files

const blobServiceClient = BlobServiceClient.fromConnectionString(
  String(process.env.BLOBSTORAGECONSTRING)
);


const blobServiceContainer = blobServiceClient.getContainerClient(
  String(process.env.BLOBSTORAGENAME)
);


export default blobServiceContainer