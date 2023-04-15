import express from 'express';
import axios from 'axios';
import { apiKey, endpoint } from '.';

export async function basicHandler(req: express.Request, res: express.Response) {
    const response = await axios.post(endpoint, JSON.stringify(req.body), {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    })

    res.json(response.data);
}