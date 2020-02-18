# Quizine / Fullstack Academy Capstone Project

\*Tell us the working name of your app!
Quizine

\*Team members
Desi, John, Slava, Adam

\*Which cohort is your capstone team in?
1911-FSA-NY-WEB-FT

\*60 character description of the app:
Analytical restaurant querying made easy

\*Project URL?
https://quizine1.herokuapp.com/

\*Give a short description of your app.
Quizine is a business analytics tool intended for restaurant management. The web application includes summary and analytics pages illustrating results from predefined stock queries, and a page that allows a non-technical user an easy and intuitive GUI for custom querying.

Our tech stack is React, Redux, Express, SQL, PostgreSQL, Yelp API, Node.js, Sequelize. Major packages we used to build our application are: Material-UI React, Chart.js, json-sql, node-postgres.
Aspects of the project we found interesting were:

* Generating randomized data applying Gaussian distribution that replicates a real-world restaurant database
* Creating a data structure that stores metadata pulled from the restaurant's database to guide the user's input process and records the custom query built by the user
* Building an intuitive GUI that allows non-technical users to generate custom analytical results
* Designing an algorithm to translate user inputs into SQL queries

Technical challenges:

* Our biggest technical challenge was to make the application scalable for databases of different size and structure to generate the data dynamically on both frontend and backend.
* For this reason, we developed a n ary tree like data structure to effectively query metadata that consists of table names, column names, and datatypes, and display it on the front end while maintaining the hierarchy of data. And also, we are sending a custom query from the user to backend to generate a sql query, and send the results back to front end.
* Due to the complexity of our data structure, it was challenging to serialize custom query directly to sql code, and therefore, we developed a function to translate custom query to serializable object to sql code.


![Technical Challenge Image](public/technicalChallenges.png)

Video link:
https://www.youtube.com/watch?v=FWVl3SgF2sc&list=PLx0iOsdUOUmkGPFdAt5kHKxGQw_YseAQI&index=18&t=0s
