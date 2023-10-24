const fetch = require('node-fetch'); // For Node.js

const workspace = 'aristo42';
const repoSlug = 'javascript-node-repo';
const pullRequestId = 1;

const getCommitsAndChangedFiles = async () => {
  const commitIds = [];
  const changedFiles = [];

  try {
    // Fetch commit IDs
    const commitsApiUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}/commits`;
    const commitsResponse = await fetch(commitsApiUrl, {
      method: 'GET',
      headers: {
      },
    });

    if (commitsResponse.status === 200) {
      const commitsData = await commitsResponse.json();
      commitIds.push(...commitsData.values.map(commit => commit.hash));
    }

    // Fetch changed files
    const diffApiUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}/diff`;
    const diffResponse = await fetch(diffApiUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ATCTT3xFfGN0Nq6PRspaSJ8zqLg0Fy9isN34lD4sUKigZUo0orHcixE4hiyP7XEj2_VYlWC5MiKk9dII5YXrLX-RHjuTx1Ma-aBNXY9NXFWLubjnfv58Vg2n5szaBN0IVNhWlU8V2we0zS4pvLk4AdRIMEWiIIlwdkUQXzrNCkfegBgzliG6-Vs=017E189F', // Replace with your access token
      },
    });

    if (diffResponse.status === 200) {
        const diffContent = await diffResponse.text();
        console.log(diffContent)
        
        // Parse the diff content to get changed file paths
        const regex = /^diff --git a\/(.*?) b\/(.*?)(?:$|\n)/gm;
        let match;
        while ((match = regex.exec(diffContent)) !== null) {
          changedFiles.push(match[2]);
        }
      }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const response = { commitIds, changedFiles }
  console.log(response)

  return response;
};

// getCommitsAndChangedFiles()

module.exports = getCommitsAndChangedFiles;
