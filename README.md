# Stocking 

#### Website for analyzing the stock price and performance of any company.
#### This is the backend of the project.
#### [Link to the frontend](https://github.com/Siddhant-Baranwal/stocking) repo of the project.

## Detailed Architecture - 
![Architecture image](https://i.ibb.co/7gX9xpB/Untitled-Diagram-drawio.png)
<!-- Image of detailed architecture -->

## List of services used -
### [Google Firebase](https://firebase.google.com/) - 
##### Pricing: Free
###### Why it is the best fit:
- Real-time database & firestore
- Easy authentication
- Cloud functions
- Hosting 
- Easy integration with google ecosystem
##### Alternatives:
- AWS Amplify
- MongoDB
- Azure App Service

---

### Deployment -
#### [Vercel](https://vercel.com/) for frontend |  [Render](https://render.com/) for backend
##### Pricing: Free versions used (Paid versions are also available.)
##### Why it is the best fit: 
- Simple and easy to use
- Auto scaling of applications
- Git integration for continuous deployment
- Managed databases (PostgreSQL, Redis)
- Supports multiple languages (Node.js, Python, etc.)
- Free SSL, automatic HTTPS, and DDoS protection
##### Alternatives: 
- DigitalOcean
- Fly.io
- Google Cloud Run
- Dokku

---

### [HighCharts](https://www.highcharts.com/) -
##### Pricing: 
- Free for personal, non-commercial use
- Paid licenses for commercial use
##### Why it is the best fit: 
- Extensive library of interactive charts and graphs.
- Supports multiple chart types (line, bar, pie, etc.).
- Highly customizable with extensive API documentation.
- Easy integration with various platforms and frameworks (React, Angular, etc.).
##### Alternatives: 
- Chart.js
- D3.js
- Google charts
- ApexCharts

---

## Why do we think our architecture is scalable: 
- Our architecture leverages managed services that automatically scale with usage. Firebase offers real-time database and Firestore, which can handle millions of concurrent connections. Vercel and Render provide auto-scaling capabilities for both the frontend and backend, meaning the infrastructure dynamically adjusts to accommodate spikes in traffic without manual intervention. Additionally, Firebase's cloud functions are designed to scale automatically, reducing the need for complex server management.

- We have also chosen to separate concerns by hosting the frontend and backend independently, allowing each to scale based on its specific load requirements. By utilizing high-performance databases and caching solutions such as Redis (offered by Render), we ensure that our application can handle increasing amounts of data and computation efficiently.

## Till what scale can we accommodate in a zero cost solution?
- At zero cost, we can handle moderate traffic and a significant number of database read/write operations, as Firebase and Render's free tiers provide generous limits. Firebase’s free tier allows up to 50,000 reads and writes per day for Firestore and 10 GB hosting storage. Render allows up to 750 hours of backend service runtime and 100 GB of bandwidth per month for free.

- However, as our application grows, limitations in bandwidth, request quotas, and database storage might require us to shift to paid tiers or adopt optimizations to fit within the free limits.

## What would have we done differently in your architecture if a zero cost solution was not a requirement?
#### If budget constraints were not a consideration, we would have optimized for performance and reliability at a much larger scale. This would involve:
- Upgrading to Firebase's Blaze plan, which offers pay-as-you-go pricing, higher usage limits, advanced features like Cloud Functions, and multi-region support.
- Adding more real-time monitoring and logging solutions such as Datadog or Prometheus to manage system health.
- Using advanced machine learning models hosted on services like AWS SageMaker or GCP AI Platform for predictive analytics.

## Steps taken to improve DX: 
- Creating the project using [ReactJS](https://react.dev/)
- Creating a good organized folder structure
- Uploading the project as a [GitHub](https://github.com/) repo so that it is easy for all members to access and changes the project.

## Steps taken to improve UX:
- [Tailwind CSS](https://tailwindcss.com/) and External CSS
- [Google Fonts](https://fonts.google.com/)
- Interactive graphs using [HighCharts](https://www.highcharts.com/)
- Use of peer focusing design technique.
- Use of day/night theme.


## Data visualization -
#### HighCharts has been utilized for data visualization, allowing us to present complex data sets in a visually engaging and interactive format. We have chosen HighCharts due to its flexibility and comprehensive charting capabilities, which include line charts, bar charts, pie charts, scatter plots, and more. This enables us to effectively represent key performance indicators such as revenue growth, diversity metrics, market share, and stock prices for companies.

- Interactive Charts
- Dynamic Updates
- Customization
- Responsive Design

## Steps that we took to make our system extendible and accept actual real time computations :
- Separate modular structure for frontend, backend and the database.
- Well-defined and organized APIs, so that any future change is easy.
- Firebase is used as it is very efficient and fast.

## Computation -
- Companies in the same country:
  Search in database where country is same as company's country.
- Companies with greater diversity, stock price, market share, revenue and expense:
  Search in database where the value is more than company's data.
- Growth and stability of the company: 
  Take the percentage difference between each consecutive year data and then average the values. If the net average is positive for return growth with the average percent, else decline with the average percent.

## Predictive analysis: 
- We are predicting the next year's data using the growth/decline value obtained from above computation on the last year's data.
- We tried to predict the next year's data using deep learning. The method used was <b><u>Stochastic Gradient Descent</u></b> . But, the results we got were giving very absurd values for the data. So, we decided to use the above method only. But, we are still looking for a better prediction technique.
- [Get the google colab notebook here](https://colab.research.google.com/drive/1khp_eWRDe5ziXGCwyw_obJtAheK3Qz26?usp=sharing)