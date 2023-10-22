// service-fetch-specific-file-in-pr.js
const fetch = require('node-fetch'); // For Node.js

const workspace = 'aristo42';
const repoSlug = 'javascript-node-repo';
const filePath = 'README.md'; // Specify the file path
const commitID = 'f5394b2b8f0d2e36c3ff9be4f2a7f533fbd36c3b'; // Specify the file path


const getSpecificFileInPR = async () => {
  const apiUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/src/${commitID}/${filePath}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
        Authorization: 'Bearer ATCTT3xFfGN0Nq6PRspaSJ8zqLg0Fy9isN34lD4sUKigZUo0orHcixE4hiyP7XEj2_VYlWC5MiKk9dII5YXrLX-RHjuTx1Ma-aBNXY9NXFWLubjnfv58Vg2n5szaBN0IVNhWlU8V2we0zS4pvLk4AdRIMEWiIIlwdkUQXzrNCkfegBgzliG6-Vs=017E189F', // Replace with your access token
    },
  });

  const data = await response.text();
  console.log(data)
  return data;
};

// getSpecificFileInPR()

module.exports = getSpecificFileInPR;
