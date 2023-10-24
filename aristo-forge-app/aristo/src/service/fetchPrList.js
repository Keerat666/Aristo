// service-fetch-open-prs.js
const fetch = require('node-fetch'); // For Node.js

const workspace = 'aristo42';
const repoSlug = 'javascript-node-repo';

const getOpenPRs = async () => {
  const apiUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/pullrequests?state=OPEN`;
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
    },
  });

  const data = await response.json();
//   console.log(data)
//   console.log(data.values[0].source)
//   console.log(data.values[0].links)
//   console.log(data.values[0].summary)

  const extractedData = data.values.slice(0, 15).map(pr => {
    return {
      id: pr.id,
      title: pr.title,
      description: pr.description,
    };
  })

  return extractedData;
};

module.exports = getOpenPRs;
