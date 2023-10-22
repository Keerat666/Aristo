const { verify } = require("crypto");
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: "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"
  });



module.exports={


    async generatePrComments(req,res)
    {

      console.log(this.generatePrompt(req.body.code))

        try {
            const completion = await openai.completions.create({
              model: "text-davinci-003",
              prompt: this.generatePrompt(req.body.code),
              temperature: 0.6,
              max_tokens: 1000
            });
            console.log("response",completion.choices[0].text)
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

     generatePrompt(code) {


        return `Act as a senior developer and simulate a situation where you are reviewing a PR. Try to make comments that highlight potential bugs and also tell me how can I resolve that bug and also return me a category for the comment telling me wether that issue is either of the three options in critcality : [High, Medium, Low] then return me a json which has an array of objects in the form , {result : [{fileName,lineNumber,comment,solutionToFixThatComment,category}]}. If you spot a piece of code that can be written in an optimized manner, please do not hesitate to highlight that and also send a potential solution for it like I explained previously for the bug spotting. Please make sure to count the number of lines properly and return the right number on which you want to comment.Check the code thoroughly for errors including but not limited to : Syntax Errors,Logic Errors,Compilation Errors,Runtime Errors and Arithmetic Errors. An example array of objects that you can send is like this : 

          {
            "result": [{fileName : 'filename.js', lineNumber : 3, comment : 'Make sure to take care of other code readability and formatting issues.', solutionToFixThatComment : 'Use proper indentation and formatting to make code readable. Run the file through a linter.', category : 'Low'}]}",
          }

        Point out things like there should not be any code that is not being used in the file. Take care of other code readability and formatting issues. But your main work is to try and spot bugs.
        
        Only return me a json after doing the code review and nothing else. Please do not return any text other than text than the final array and return the text in a form that if I do JSON.parse then I get a perfectly working json object of the exact format as specified above.
        
        If you have no comments on the code then return
        
        {
          "result": [],
        }

        Do not deviate from the response format that I have explained for any scenario.
        
        The code to be reviewed is as follows : 

        ${code}

        `;
      },


}