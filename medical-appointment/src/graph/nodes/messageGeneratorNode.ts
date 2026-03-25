import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';
import { AIMessage } from 'langchain';
import { getSystemPrompt, getUserPromptTemplate, MessageSchema } from '../../prompts/v1/messageGenerator.ts';


export function createMessageGeneratorNode(llmClient: OpenRouterService) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        console.log(`💬 Generating response message...`);

        try {
            const hasSuccess = state.actionSuccess ? "success" : "error";
            const scenario = `${state.intent ?? 'unknown'}_${hasSuccess}`;
            const details ={
                professionalName: state.professionalName,
                datetime: state.datetime,
                patientName: state.patientName,
                error: state.actionError ?? state.error
            }

            const SystemPrompt = getSystemPrompt()
            const userPrompt = getUserPromptTemplate({scenario, details})

            const result = await llmClient.generateStructured(SystemPrompt, userPrompt, MessageSchema)

            console.log(`✅ Message generated successfully:`, result.data?.message ?? result.data ?? result);

            if(result.error){
                console.error('❌ Error from LLM response:', result.error);
                return {
                    messages: [
                        ...state.messages,
                        new AIMessage('I am missing!')
                    ],
                };
            }
            return {

                messages: [
                    ...state.messages,
                    new AIMessage(result.data!.message)
                ],
            };
        } catch (error) {
            console.error('❌ Error in messageGenerator node:', error);
            return {
                ...state,
                messages: [
                    ...state.messages,
                    new AIMessage('An error occurred while processing your request.')
                ],
            };
        }
    };
}
