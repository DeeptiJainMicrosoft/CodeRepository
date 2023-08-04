// Code Overview
//The below code can be used in your Node JS application to connect to clustered Azure Redis cache using io redis library on TLS port.

//Steps to follow
//Download DigiCert Global Root G2 certificate on your machine from 
//Link: https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.digicert.com%2Fkb%2Fdigicert-root-certificates.htm&data=05%7C01%7Cdeeptijain%40microsoft.com%7C9f5f381bae424505ba2e08db666ba854%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C638216385100042625%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=6d9IrvpQy7%2FPQexBNKRAZKiWYOOPG%2FTJdyGp9UIvZr4%3D&reserved=0
//if it is missing and place in the folder where your application resides.
//Further, the code below needs to be modified as per your environment setup.
//Please test your application.

// DISCLAIMER
// By using the following materials or sample code you agree to be bound by the license terms below 
// and the Microsoft Partner Program Agreement the terms of which are incorporated herein by this reference. 
// These license terms are an agreement between Microsoft Corporation (or, if applicable based on where you 
// are located, one of its affiliates) and you. Any materials (other than sample code) we provide to you 
// are for your internal use only. Any sample code is provided for the purpose of illustration only and is 
// not intended to be used in a production environment. We grant you a nonexclusive, royalty-free right to 
// use and modify the sample code and to reproduce and distribute the object code form of the sample code, 
// provided that you agree: (i) to not use Microsoft’s name, logo, or trademarks to market your software product 
// in which the sample code is embedded; (ii) to include a valid copyright notice on your software product in 
// which the sample code is embedded; (iii) to provide on behalf of and for the benefit of your subcontractors 
// a disclaimer of warranties, exclusion of liability for indirect and consequential damages and a reasonable 
// limitation of liability; and (iv) to indemnify, hold harmless, and defend Microsoft, its affiliates and 
// suppliers from and against any third party claims or lawsuits, including attorneys’ fees, that arise or result 
// from the use or distribution of the sample code. 

const Redis = require("ioredis");
const fs = require('fs');
const path = require('path');

const cluster = new Redis.Cluster([
    {
      port : 6380,
      host : "xxx—your-redis-cache-host-name—xxx"    }
  ],
  { 
    scaleReads: 'all', 
    slotsRefreshTimeout: 50000, 
    enableReadyCheck: true, 
    redisOptions: { 
      tls: {
        ca: fs.readFileSync(path.resolve("DigiCertGlobalRootG2.crt.pem")),
        rejectUnauthorized: false
      },
      password: "xxx—your-redis-cache-key—xxx"
    }, 
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },       
    reconnectOnError(err) {
      // try to reconnect only when the error contains "READONLY"
      const targetError = "READONLY";
      if (err.message.includes(targetError)) {
        return true; 
      }
    },                
  });

cluster.set("today", "application");
cluster.get("today", (err, res) => {
  console.log(res);
});
