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


        return `Act as a senior developer and simulate a situation where you are reviewing a PR. Try to make only comments that are feasible and sensible and also tell me how can I resolve that comment and also return me a category for the comment telling me wether that comment is either of the three options in critcality : [High, Medium, Low] then return me a json which has an array of objects in the form , {response : [{fileName,lineNumber,comment,solutionToFixThatComment,category}]}

        Point out things like there should not be any code that is not being used. Take care of other code readability and formatting issues.
        
        Only return me a json after doing the code review and nothing else. If you have no comments then return an empty array.Please do not return any text other than the final array and return the text in a form that if I do JSON.parse then I get a perfectly working json.If you have no comments or the code below is empty then return {response : []}
        
        The code is as follows : 

        ${code}

        `;
      },


}