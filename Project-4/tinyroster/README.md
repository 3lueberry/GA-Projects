<div>
  <p align="center"> 
    <img width="250" src="https://user-images.githubusercontent.com/99118414/167263562-639d4b2c-8818-40d1-8217-5990588d1c84.PNG" alt="Login Page" border="0" />
    <img  width="250" src="https://user-images.githubusercontent.com/99118414/167263558-1897b798-9376-4b91-a3d6-d6bde552d1c3.PNG" alt="Login Page" border="0" />
    <img  width="250" src="https://user-images.githubusercontent.com/99118414/167263554-7ee45bd0-7f32-4783-83d6-702f0be4084b.PNG" alt="Login Page" border="0" />
  </p>
  <p align="center"> 
    <img width="250" src="https://user-images.githubusercontent.com/99118414/167263553-92ae2f2f-397d-41cf-a5cf-70a752d3ddaf.PNG" alt="Login Page" border="0" />
    <img  width="250" src="https://user-images.githubusercontent.com/99118414/167263552-0789f772-7fb3-40bf-9d39-3cf1e0c026bd.PNG" alt="Login Page" border="0" />
  </p>
</div>

<h2 align="center">
# GA-Projects -- Projects for General Assembly SEI course --
</h2>
<h3 align="center">
Project #4: TinyRoster | Haken on mobile
</h3>

# What is TinyRoster? 🤔

The idea of **TinyRoster** came from a business owner who started a franchise and was facing manpower issues. Haken is the Japanese term for temporary employees who are dispatched to client companies by staffing agencies. Under this model, the dispatch workers' employment contracts are entered directly with a staffing company and not with the end-client to whom the haken employees render services. The app could provide flexiblity and mobility of employee within the same organisation and empower the start of new branch or a call team.


### React Native Installation

``
-> npm install -g expo-cli
``
``
-> npm install -legacy-peer-deps
``

### Checking for dependencies errors
``
-> expo doctor
``
``
-> expo upgrade
``

### Start/Run
``
-> expo start
``
or
``
-> expo start --clear
``


## Planning & Development
<p align="center">
<img width="798" alt="dbdiagram" src="https://user-images.githubusercontent.com/99118414/167264517-910d705c-a1e0-4694-9e67-4acc38a4e5d5.png">
</p>

### How is it developed? 🧑🏻‍💻

***Front-end***
```
- React Native with Expo-CLI
- Redux Toolkit
- Redux Persist
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- @react-navigation/material-top-tabs
- Axios AJAX
- Custom Hooks
```

***Back-end***
```
- Python
- Django
- psycopg2
- Django REST Framework
- Simple JWT
- Django Admin 
```

***Database***
```
- Postgres Database on Heroku
```

**_Currently availabe feature:_**

```
- Create / Update / Delete Users
- Login as Admin / Manager / Parttimer
- Create Jobs as Manager and update job status
- Apply for job / Update job status / Check-in / Check-out
```

**_Future Features:_**

```
- Time sheet records
- Human Resource Tools
- Full Timer scheduling
```

## User Stories

Employees are the golden resource of any organisation that effectively drives its operations. To sustain this, organisational leaders must take relevant steps to protect employee wellbeing (to keep them engaged in the job) while strengthening job security (to protect the employees’ bread and butter), in ways that prevent possible lay-offs.
These require organisations to consistently review manpower structures, by identifying, for instance:
```
 - Shortages or surpluses across job categories
 - Skills gaps vis-à-vis developments in technology
 - Recruitment needs and opportunities to address changing industry demands and trends
```


### Problem Sovling

## Difficulties 🚧

```
 - Concern on security of the backend make it harder for its own front-end to connect
 - Designing an app that has multiple layout based on user permission
 - Database design chaged drastically from original design
 - Optimization of code leads to more errors instead
 - 
```
