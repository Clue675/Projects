import React, { useState } from 'react';

const ChatInterface: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
        const res = await fetch('/api/chatgpt/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        setResponse(data.response);
    };

    return (
        <div className="p-4">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask the AI something..."
                className="w-full p-2 border rounded"
            />
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded mt-2">
                Ask
            </button>
            <div className="mt-4">
                <h3 className="text-lg font-bold">AI Response:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default ChatInterface;