import { Http2ServerRequest } from "http2";

console.assert(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY is not set in environment variables");

export type ModelConfig = {
    apiKey: string;
    HttpReferer: string;
    xTitle: string;
    port: number;
    models: string[];
    temperature: number;
    maxTokens: number;
    systemPrompt: string;  
    
    provider:{
        sort:{
            by:string,
            partition:string,
        }
    }
}

export const config : ModelConfig ={
    apiKey: process.env.OPENROUTER_API_KEY!,
    HttpReferer: "http:/pos-ai-com.br",
    xTitle: "Smart Model Router Gateway",
    port:3000,
    models:[
        "openrouter/hunter-alpha"
    ],
    temperature: 0.2,
    maxTokens: 50,
    systemPrompt: "You are a helpful assistant.",
    provider:{
        sort:{
            by:"price",
            partition:"none",
        }
    }

}