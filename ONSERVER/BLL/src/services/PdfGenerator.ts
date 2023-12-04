/*const fs = require('fs');
var path = require('path');
const pdf = require("html-pdf-node")
const ejs = require('ejs');
import stream from 'stream';

// service to generate certificate pdf



const defaultData = {
    user: "rodrigo",
    course:"Matematica A",
    date: "06/01/2022"
};  


export default async ( data:ICertificateData ) => {
    try {
    

        if(data == null)
            data=defaultData

        const filePathName = path.resolve(__dirname, '../views/certificate.ejs');
        
        const htmlString = fs.readFileSync(filePathName).toString();

        let  options = { format: 'A3' };

        const ejsData = ejs.render(htmlString, data);

        let file = {content: ejsData}
       
        return await pdf.generatePdf(file, options).then((pdfBuffer: any) => {
            const htmlStream = new stream.Readable({
                read() {
                  this.push(pdfBuffer); // push buffer into stream
                  this.push(null); // signal the end of stream
                }
              });
              return htmlStream;

        });
        /*.toFile('generatedfile.pdf',(err:any, response:any) => {
            
            if (err) return console.log(err);
            
            return response;
        
        });
        
       
    } catch (err) {
        console.log("Error processing request: " + err);
    }


}

*/
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { Readable } from 'stream';

interface ICertificateData {
  user: string;
  course: string;
  date: string;
}

const convertEjsToFileStream = async (data: ICertificateData): Promise<Readable> => {
  const filePathName = path.resolve(__dirname, '../views/certificate.ejs');
  const htmlString = fs.readFileSync(filePathName).toString();

  const ejsData = ejs.render(htmlString, data);

  const buffer = Buffer.from(ejsData, 'utf-8');

  return Readable.from([buffer]);
};


export default convertEjsToFileStream;
