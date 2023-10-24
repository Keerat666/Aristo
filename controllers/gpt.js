const { verify } = require("crypto");
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.gpt_key
  });



module.exports={


    async generatePrComments(req,res)
    {


        try {
            const completion = await openai.completions.create({
              model: "text-davinci-003",
              prompt: this.generatePrompt(req.body.code, req.body.fileName),
              temperature: 0.8,
              max_tokens: 1000
            });
            console.log("response",completion.choices[0].text)

            const cleanedData = completion.choices[0].text
            .replace(/\n/g, '') // Remove newlines
            .replace(/\s*:\s*/g, ':') // Remove spaces around colons
            .replace(/([\w-]+):/g, '"$1":') // Quote keys
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/\\+/g, '');
            
          
            // Parse the cleaned JSON string into an object
            const jsonObject = JSON.parse(cleanedData);
            //parse happened properly as gpt send a valid json
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).replace(/\//g, '-').replace(/,/, '');
                        // Create the filename
            const fileName = `${req.body.prName}-${req.body.fileName}-${formattedDate}.txt`;
            // Write the result to a text file
            fs.writeFileSync(path.join(__dirname, 'AristoReviewLogs', fileName),JSON.stringify(jsonObject));

            res.status(200).json({ result: completion.choices[0].text });
          } catch(error) {
            // Consider adjusting the error handling logic for your use case
            console.log(error.response)

            if (error.response) {
              console.error(error.response.status, error.response.data);
              res.status(error.response.status).json(error.response.data);
            } else {
              console.error(`Error with OpenAI API request: ${error.message}`);
              res.status(500).json({
                error: {
                  message: 'An error occurred during your request.',
                }
              });
            }
        }
    },

    async fetchAllFiles(req,res)
    {
      const directoryPath=path.join(__dirname, 'AristoReviewLogs')
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
      
        // 'files' is an array of file names in the directory
        console.log('Files in the directory:');
        const result = []
        files.forEach(file => {
          console.log(file);
          result.push(file)
        });
        res.status(200).json({ dropdown: result });
      });


    },

    async fetchContentOfFile(req,res)
    {
        // Check if the file exists
        const directoryPath=path.join(__dirname, 'AristoReviewLogs',req.body.fileName)

        if (!fs.existsSync(directoryPath)) {
          res.status(404).json({ error: 'File not found' });
          return;
        }

        try {
          // Read the file content
          const fileContent = fs.readFileSync(directoryPath, 'utf8');

          // Parse the content to JSON
          const jsonData = JSON.parse(fileContent);

          res.json(jsonData);
        } catch (error) {
          res.status(500).json({ error: error });
        }
    },

     generatePrompt(code,filename) {


        return `Act as a senior developer and simulate a situation where you are reviewing a PR. Try to make comments that highlight potential bugs and also tell me how can I resolve that bug and also return me a category for the comment telling me wether that issue is either of the three options in critcality : [High, Medium, Low] then return me a json which has an array of objects in the form , {result : [{fileName,lineNumber,comment,solutionToFixThatComment,category}]}. If you spot a piece of code that can be written in an optimized manner, please do not hesitate to highlight that and also send a potential solution for it like I explained previously for the bug spotting. Please make sure to count the number of lines properly and return the right number on which you want to comment.Be xtra sure for the line number and count them properly. Check the code thoroughly for errors including but not limited to : Syntax Errors,Logic Errors,Compilation Errors,Runtime Errors and Arithmetic Errors. An example array of objects that you can send is like this : 

          {
            "result": [{fileName : 'filename.js', lineNumber : 3, comment : 'Make sure to take care of other code readability and formatting issues.', solutionToFixThatComment : 'Use proper indentation and formatting to make code readable. Run the file through a linter.', category : 'Low'}]}",
          }

        Point out things like there should not be any code that is not being used in the file. Take care of other code readability and formatting issues. But your main work is to try and spot bugs.
        
        Only return me a json after doing the code review and nothing else. Please do not return any text other than text than the final array and return the text in a form that if I do JSON.parse then I get a perfectly working json object of the exact format as specified above.
        
        If you have no comments on the code then return
        
        {
          "result": [],
        }

        Please do not return me a JSON which is starting like : "result": "\n{\n \"result\":. This format is completely wrong and do not use it in your final json text.

        Do not deviate from the response format that I have explained for any scenario.

        You can detect the language of the code from the file name which is ${filename}
        
        The code to be reviewed is as follows : 

        ${code}

        `;
      },


}