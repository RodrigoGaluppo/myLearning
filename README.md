# MyLearning Project

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/2d0d474c-ad17-4727-9666-889136f71d24)

The MyLearning project was developed as part of the Professional Aptitude Test for the Technical Course in Programming and Information Systems in 2023 at INETE.

The project is a cloud-based online course platform, incorporating modern development technologies and standards that make the application extremely versatile and responsive. It combines programming concepts, information security, and infrastructure to create a resilient application.

## Description of the Product
The project features a modern web application that can also be installed on desktops and smartphones. Once installed, the application functions like a native app on the device, enhancing user experience and credibility, and extending its usability across a wide range of devices.

Users have a comprehensive learning experience, including course registration, viewing lessons (containing text and video resources), receiving certificates upon course completion, and an exclusive forum for each course to build a community. Email notifications for updates such as account blocking are also included.

The project also includes a web application specifically for course management, with modern authentication and authorization techniques ensuring only selected users have access. Managers can manage users, courses, modules, chapters, and lessons, and receive insights through graphs for data analysis.

## Goals of the Project
- Deliver a platform: responsive, flexible, modern, and robust.
- Utilize modern and scalable web development techniques.
- Promote security of both data and application infrastructure.
- Focus on portability, providing support for as many platforms as possible to reach a wider audience.

## Data Modeling
Data modeling was a fundamental step in the development process of MyLearning. The model was designed to cater to the diverse requirements of delivering complete educational content to users while ensuring the security and integrity of the application. Here's an overview of each entity in the database:

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/abe95e30-4087-4b0e-a6bd-32792f27be14)

- **Customer**: Represents end-users of the application who browse courses and consume content.
- **Subject**: Represents the subject matter of each course in the application.
- **Course**: Represents individual courses offered on the platform, with a one-to-many relationship with the Subject entity.
- **CustomerCourse**: A relational table representing the enrollment of a student in a course, facilitating many-to-many relationships between students and courses.
- **Certificate**: Represents a student's course completion certificate, with a one-to-one relationship with the CustomerCourse table.
- **Chapter**: Represents chapters within each course, with a one-to-many relationship with the Course entity.
- **Lesson**: Represents individual lessons within chapters, with a one-to-many relationship with the Chapter table.
- **AccomplishedLesson**: A relational table representing the completion of lessons by students, enabling many-to-many relationships between students and lessons.
- **TextLesson**: Represents textual content within each lesson, with a one-to-many relationship with the Lesson entity.
- **ResourceLesson**: Represents additional resources and links associated with each lesson, with a one-to-many relationship with the Lesson table.
- **VideoLesson**: Stores information necessary for displaying videos within lessons, with a one-to-many relationship with the Lesson entity.
- **Employee**: Represents administrative users responsible for managing courses and students.
- **Question**: Represents questions posted by users in course forums, with a many-to-many relationship between users and courses.
- **Comment**: Represents user responses to questions, forming a many-to-many relationship between the Question and Customer entities.

## Project Structure

The MyLearning project is structured into several layers, each serving a specific role in the application's functionality. The final deployment architecture involves deploying each layer within a Virtual Network (VNET) for network isolation and security. Here's an overview of each layer and its deployment:

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/315a0e75-91f0-4693-b9cf-7a275d3f0ac8)


### Frontend Layer

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/ae1e42e0-7c63-4925-96cb-73bd3eb6d650)


- **Description**: The frontend layer consists of two React Progressive Web App (PWA) TypeScript applications deployed to Vercel, providing a responsive and interactive user interface.
- **Deployment**: Deployed to Vercel for hosting and scalability.
- **App Folder Structure**:
  - `public`: Stores static files accessible publicly, such as HTML, CSS, images, and fonts.
  - `src`:
    - `components`: Contains reusable components of the application.
    - `hooks`: Stores custom hooks used for managing component state.
    - `pages`: Houses the page components structured with React components for dynamic loading.
    - `routes`: Contains files related to application routing using React Router.
    - `services`: Stores configurations for communication with external services.

### Subnet BLL (Business Logic Layer)

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/4e8d8305-61b3-4805-923f-82c2ef139cd7)


- **Description**: The BLL subnet houses the business logic of the application. It comprises a virtual machine (VM) with Docker Compose orchestrating containers. An Nginx container manages traffic, routing requests to containers running instances of the BLL application built with Node.js and TypeScript. The BLL communicates with MongoDB Atlas for token management and Azure Blob Storage to retrieve information about courses and certificates.
- **Deployment**: Deployed within a VM on the cloud platform, with Docker Compose orchestrating containers.
- **App Folder Structure**:
  - `bll`:
    - `src`:
      - `Certbot`: Configuration for Let's Encrypt TLS certificate.
      - `Nginx`: Nginx server configuration.
      - `Domains`:
        - `customer`, `employee`, `anonymous`: Separate folders for different user types.
          - `controllers`: Contains controller files for handling API routes.
          - `global`: Global configuration files.
          - `middlewares`: Middlewares for request processing.
          - `services`: Methods and configurations for external services.
          - `views`: EJS templates for dynamic HTML generation.

### Subnet DAL (Data Access Layer)

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/be27202b-a0f2-428b-acb6-15a9adb2632b)

- **Description**: The DAL subnet serves as the interface for accessing the application's data. It consists of a VM with Docker Compose orchestrating containers. An Nginx container balances traffic to containers running instances of the DAL application built with .NET Core 6. The DAL layer communicates with the database layer to retrieve and manipulate data.
- **Deployment**: Deployed within a VM on the cloud platform, with Docker Compose orchestrating containers.
- **App Folder Structure**:
  - `dal`:
    - `bin`: Contains binary files generated during compilation.
    - `Controllers`: Holds controllers for handling HTTP requests.
    - `Global`: Global configuration files.
    - `Logs`: Stores error logs for debugging purposes.
    - `Models`: Contains data models generated from the database schema.
    - `Nginx`: Nginx server configuration.
    - `Properties`: Project-related properties.
    - `Services`: Service configurations and methods.

### Database Layer

![image](https://github.com/RodrigoGaluppo/myLearning/assets/68329584/52f968af-2221-4db8-bae3-2ed32722a556)

- **Description**: The database layer utilizes PostgreSQL as a Platform as a Service (PAAS) on Azure, providing a reliable and scalable solution for storing application data. It serves as the backend data store for the entire application, ensuring data integrity, reliability, and accessibility.
- **Deployment**: Deployed as a PostgreSQL service on Azure..
