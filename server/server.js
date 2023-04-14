import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration=new Configuration({apiKey: process.env.OPENAI_API_KEY});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());
app.use(cors());

//get for the prompt
app.get('/', async (req,res)=>{
    res.status(200).send({
        message: "message: "
    })
});

//post for the prompt
app.post('/', async (req,res)=>{
    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            max_tokens: 2800, //max_tokens allowed per response
            top_p: 1, 
            frequency_penalty:0.6, // do not repeat similar sentences often
            presence_penalty:0, 
            temperature: 0.3, // adds only a slight risk to the model 
        });
        res.status(200).send({bot: response.data.choices[0].text});
    }
    catch(error){
        console.log(error);
        res.status(500).send({error});
        alert("An error has occurred, please try again!");
    }
})

app.listen(5000, ()=>console.log("Server is running on port 5000"));