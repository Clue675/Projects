import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// console.log(process.env.OPENAI_API_KEY);

const Configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(Configuration);

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Greetings from CodeX",
    })
});


app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createChatCompletion({
            model: "text-davinci-003",
            prompt:`${prompt}`,
            //Temperture value means the AI model will take more risk in providing solutions.
            temperature: 0,
            //Max Tokens is the length of the response the AI can provide. (More the marrier)
            max_tokens: 3000,
            top_p: 1,
            //frequenct pen means that its not going to repeat similar sentences often.
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choicess[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })

    }

})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))