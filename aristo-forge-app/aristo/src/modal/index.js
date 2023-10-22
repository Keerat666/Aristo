import ForgeUI, { ModalDialog, useState, Text, Fragment,Button,Strong,Heading } from "@forge/ui";
import api, { route } from "@forge/api";
const fetch = require('node-fetch'); // For Node.js



const PrModal = (props) => {


  const [isOpen, setOpen] = useState(props.modal);
  const [PrCommentsMode, setPrCommentsMode] = useState(false);
  const [commitID , setCommitID] = useState("")
  const [prComments, setPrComments] = useState([]); // State for PR list
  const changedFiles=async (props)=>{
    const commitIds = [];
    const changedFiles = [];
    const res = await api
    .asApp()
    .requestBitbucket(route`/2.0/repositories/${props.workspaceId}/${props.repoId}/pullrequests/${props.pr.PrListDropdown.id}/commits`);
  
    const data = await res.json();
    console.log(data)
    commitIds.push(...data.values.map(commit => commit.hash));
    const resDiff = await api
    .asApp()
    .requestBitbucket(route`/2.0/repositories/${props.workspaceId}/${props.repoId}/pullrequests/${props.pr.PrListDropdown.id}/diff`);
  
    if (resDiff.status === 200) {
      const diffContent = await resDiff.text();
      console.log(diffContent)
      
      // Parse the diff content to get changed file paths
      const regex = /^diff --git a\/(.*?) b\/(.*?)(?:$|\n)/gm;
      let match;
      while ((match = regex.exec(diffContent)) !== null) {
        changedFiles.push(match[2]);
      }
    }
  
    const changedFilesList = {changedFiles }
    const latestCommitId = commitIds[0]
    setCommitID(latestCommitId)
    console.log(changedFilesList)
    console.log(latestCommitId)  
    return changedFilesList
  

  }

 const [fileList, setFileList] = useState(async () => await changedFiles(props)); // State for PR list


  const triggerAnalyze = async () => {

    let arr=[]

    console.log("Trigger analyze : "+fileList.changedFiles.length)

    try{
    for (let i = 0; i < fileList.changedFiles.length; i++) {
      const fileName=fileList.changedFiles[i];
      console.log("PR review started for : "+fileName)
      const res = await api
      .asApp()
      .requestBitbucket(route`/2.0/repositories/${props.workspaceId}/${props.repoId}/src/${commitID}/${fileName}`);
    
      const data = await res.text();
      console.log("File content extracted : "+fileName)

      const requestBody = {
        code: data
      };
      console.log("Sending Aristo Request: "+requestBody)

      const apiUrl = `https://aristo-fzl2.onrender.com/api/review`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody), // Convert the body parameters to JSON
  
      });
    
      const aristoComments = await response.json();
      // Parse the response result as JSON

      console.log(aristoComments)

      const cleanedData = aristoComments.result
      .replace(/\n/g, '') // Remove newlines
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/([\w-]+):/g, '"$1":') // Quote keys
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/\\+/g, '');
      
    
    // Parse the cleaned JSON string into an object
    const jsonObject = JSON.parse(cleanedData);

      console.log("Aristo response looks like : ")

      console.log(jsonObject)

      // Modify the 'fileName' property in the array
      const modifiedArray = jsonObject.result.map(item => {
        item.fileName = fileName; 
        return item;
      });
      arr.push(modifiedArray)
    }

    console.log("Final Aristo comments look like : ")
    console.log(arr)
    setPrComments(arr)
    setPrCommentsMode(true)
  }catch(error)
  {
    console.log(error)
  }

  };

  const addComments = async () => {

    for (const commentGroup of prComments) {
      for (const comment of commentGroup) {
        const { fileName, lineNumber, comment: commentContent,solutionToFixThatComment } = comment;
        const fileToComment = fileName;
        
        const requestBody = {
          content: {
            raw: commentContent+"\n\nSolution : "+solutionToFixThatComment,
          },
          inline: {
            path: fileToComment,
            to: lineNumber,
          },
        };
  
        try {
          const response = await api
            .asApp()
            .requestBitbucket(route`/2.0/repositories/${props.workspaceId}/${props.repoId}/pullrequests/${props.pr.PrListDropdown.id}/comments`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });
  
          if (response.status === 201) {
            console.log(`Comment created successfully on ${fileToComment} at line ${lineNumber}: ${commentContent}`);
          } else {
            console.error('Failed to create a comment.');
            console.log(await response.text());
          }
        } catch (error) {
          console.error('Error creating a comment:', error);
        }
      }
    }

    setOpen(false)


  };

  return (
    <Fragment>
      {isOpen && (
        <ModalDialog
          header="PR Review by Aristo"
          onClose={() => setOpen(false)}
          width={"large"}
        >
          {!PrCommentsMode && (
            <Fragment>
              <Text>PR Title : {props.pr.PrListDropdown.title}</Text>

              <Text>A list of files that have been changed in this PR : </Text>

              {fileList.changedFiles.map((fileName) => (

                <Fragment>
                <Text> {fileName}</Text>
                </Fragment>
      ))}

              <Button text="Review my Code" onClick={triggerAnalyze} />
            </Fragment>
          )}

{PrCommentsMode && (
  <Fragment>
  <Fragment>
    <Text>The following comments were made by Aristo for each file :</Text>


    <Fragment>
    {prComments.map((commentGroup, groupIndex) => (
        <Fragment key={groupIndex}>
          <Heading size="medium" >File {groupIndex + 1}</Heading>
          {commentGroup.map((comment, commentIndex) => (
            <Fragment key={commentIndex}>
              <Heading size="small">Comment {commentIndex + 1}</Heading>
              <Text>File Name: {comment.fileName}</Text>
              <Text>Line Number: {comment.lineNumber}</Text>
              <Text>Comment: {comment.comment}</Text>
              <Text>Solution: {comment.solutionToFixThatComment}</Text>
              <Text>Fix Category: {comment.category}</Text>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Fragment>
  </Fragment>
      <Button text="Add Comments on PR" onClick={addComments} />
   </Fragment>

)}

        </ModalDialog>
      )}


    </Fragment>
  );


};

export default PrModal;
