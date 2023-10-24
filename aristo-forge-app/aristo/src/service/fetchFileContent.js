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
    },
  });

  const data = await response.text();
  console.log(data)
  return data;
};

// getSpecificFileInPR()

module.exports = getSpecificFileInPR;
