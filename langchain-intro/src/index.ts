import { createServer } from "./server.ts";

const app = createServer();
await app.listen({port: 3000, host: '0.0.0.0'})

console.log(`Server is running at http://localhost:3000`);

// app.inject({
//     method: 'POST',
//     url: '/chat',
//     body:{ question: "What is the capital of France?" }
// }).then(response => {
//     console.log('Response Status:', response.statusCode);
//     console.log('Response body:', response.body);
// })
