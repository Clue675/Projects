import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY || '');

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'API key not found. Please set the OPENAI_API_KEY environment variable.' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        const response = await openai.Completion.create({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 150,
        });

        res.status(200).json({ response: response.choices[0].text.trim() });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
};
