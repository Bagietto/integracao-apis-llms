import type { Runtime } from '@langchain/langgraph';
import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../graph.ts';
import { ChatResponseSchema, getSystemPrompt, getUserPromptTemplate } from '../../prompts/v1/chatResponse.ts';
import { HumanMessage } from 'langchain';
import { PreferencesService } from '../../services/preferencesService.ts';
import { config } from '../../config.ts';

export function createChatNode(llmClient: OpenRouterService, preferencesService: PreferencesService ) {
  return async (state: GraphState, runtime?: Runtime): Promise<Partial<GraphState>> => {
    const userId = String(runtime?.context?.userId || state.userId || "unknown_user");

    const userContext=state.userContext ?? await preferencesService.getBasicInfo(userId);
    const systemPrompt = getSystemPrompt(userContext);

    const conversationHistory = state.messages
    .map((msg) => `${HumanMessage.isInstance(msg) ? 'User' : 'AI'}: ${msg.content}`)
    .join('\n');

    const userMessage = state.messages.at(-1)?.text as string;

    const userPrompt = getUserPromptTemplate(
      userMessage, 
      conversationHistory
    );

    const result = await llmClient.generateStructured(      
      systemPrompt,
      userPrompt,
      ChatResponseSchema      
    )

    if(!result.success || !result.data) {
      console.error('Failed to generate structured response from LLM');
      return {
        messages:[new HumanMessage('Sorry, I had trouble generating a response. Please try again.')]
      };
    }

    const response = result.data;
    const totalMenssages = state.messages.length;

    const needsSummarization = totalMenssages >= config.maxMessagesToSummarize; // Example condition to trigger summarization

    return {
      messages: [
        new HumanMessage(response.message)
      ],
      extractedPreferences: response.shouldSavePreferences ? response.preferences : undefined,
      needsSummarization,
    };
  };
}
