// service-comment-on-files.js
const fetch = require('node-fetch'); // For Node.js

const workspace = 'aristo42';
const repoSlug = 'javascript-node-repo';
const pullRequestId = 1;
const fileToComment = 'README.md'; // Specify the file path
const lineNumber = 10; // Specify the line number where you want to comment
const commentContent = 'Silly comment.';

const commentOnFile = async () => {
  const apiUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments`;

  const requestBody = {
    content: {
      raw: commentContent,
    },
    inline: {
      path: fileToComment,
      to: lineNumber,
    },
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        Authorization: 'Bearer ATCTT3xFfGN0Nq6PRspaSJ8zqLg0Fy9isN34lD4sUKigZUo0orHcixE4hiyP7XEj2_VYlWC5MiKk9dII5YXrLX-RHjuTx1Ma-aBNXY9NXFWLubjnfv58Vg2n5szaBN0IVNhWlU8V2we0zS4pvLk4AdRIMEWiIIlwdkUQXzrNCkfegBgzliG6-Vs=017E189F', // Replace with your access token
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  console.log(data)
  return data;
};

// commentOnFile()
module.exports = commentOnFile;
