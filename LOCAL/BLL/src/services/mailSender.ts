import path from "path"
import fs from "fs"
import ejs from "ejs"

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) // get env variables

// service to send e-mailss

const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINGBLUEAPIKEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


export default {

    sendVerifyEmail: async ({
      name,email,id
    }:{name:string,email:string,id:string})=>{

        const filePathName = path.resolve(__dirname, '../views/verifyEmail.ejs');
          
        const htmlString = fs.readFileSync(filePathName).toString();

        const ejsData = ejs.render(htmlString, { name: name, confirmationLink:`http://${process.env.APPADRESSFRONTOFFICE}/confirmEmail/${id}` });

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = "Welcome {{params.subject}}";
        sendSmtpEmail.htmlContent = ejsData;
        sendSmtpEmail.sender = {"name":"my learning team","email":process.env.SENDINGBLUEMAILFROM};

        sendSmtpEmail.to = [{"email":email,"name":name}];
        //sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
        //sendSmtpEmail.bcc = [{"email":email,"name":"rodrigo"}];
        //sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};

        sendSmtpEmail.params = {"subject":"" + name};

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data:any) {
            console.log('email sent successfully: ' + JSON.stringify(data));
        }, function(error:any) {
          console.error(error);
        });
    },

    sendChangePasswordEmail: async ({
      name,email,tokenId
    }:{name:string,email:string,tokenId:string})=>{

        const filePathName = path.resolve(__dirname, '../views/changePassword.ejs');
          
        const htmlString = fs.readFileSync(filePathName).toString();

        const ejsData = ejs.render(htmlString, 
          { name: name, confirmationLink:`http://${process.env.APPADRESSFRONTOFFICE}/changePassword/${tokenId}` });

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = "Change Password {{params.subject}}";
        sendSmtpEmail.htmlContent = ejsData;
        sendSmtpEmail.sender = {"name":"my learning team","email":process.env.SENDINGBLUEMAILFROM};

        sendSmtpEmail.to = [{"email":email,"name":name}];
        //sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
        //sendSmtpEmail.bcc = [{"email":email,"name":"rodrigo"}];
        //sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};

        sendSmtpEmail.params = {"subject":"" + name};

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data:any) {
            console.log('email sent successfully: ' + JSON.stringify(data));
        }, function(error:any) {
          console.error(error);
        });
    },

    sendSuspendedAccountEmail: async ({
      name,email
    }:{name:string,email:string})=>{

        const filePathName = path.resolve(__dirname, '../views/accountSuspended.ejs');
          
        const htmlString = fs.readFileSync(filePathName).toString();

        const ejsData = ejs.render(htmlString, { name: name });

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = "Account suspended";
        sendSmtpEmail.htmlContent = ejsData;
        sendSmtpEmail.sender = {"name":"my learning team","email":process.env.SENDINGBLUEMAILFROM};

        sendSmtpEmail.to = [{"email":email,"name":name}];
        //sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
        //sendSmtpEmail.bcc = [{"email":email,"name":"rodrigo"}];
        //sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};


        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data:any) {
            console.log('email sent successfully: ' + JSON.stringify(data));
        }, function(error:any) {
          console.error(error);
        });
    },
    
    sendEnabledAccountEmail: async ({
      name,email
    }:{name:string,email:string})=>{

        const filePathName = path.resolve(__dirname, '../views/accountEnabled.ejs');
          
        const htmlString = fs.readFileSync(filePathName).toString();

        const ejsData = ejs.render(htmlString, { name: name });

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Account Active"

        sendSmtpEmail.htmlContent = ejsData;
        sendSmtpEmail.sender = {"name":"my learning team","email":process.env.SENDINGBLUEMAILFROM};

        sendSmtpEmail.to = [{"email":email,"name":name}];
        //sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
        //sendSmtpEmail.bcc = [{"email":email,"name":"rodrigo"}];
        //sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};


        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data:any) {
            console.log('email sent successfully: ' + JSON.stringify(data));
        }, function(error:any) {
          console.error(error);
        });
    },
}