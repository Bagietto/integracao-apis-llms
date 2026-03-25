import type { GraphState } from '../graph.ts';
import { getSystemPrompt, getUserPromptTemplate, IntentSchema,  } from '../../prompts/v1/identifyIntent.ts';
import { professionals } from '../../services/appointmentService.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';

export function createIdentifyIntentNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`ðŸ” Identifying intent...`);
    const input = state.messages.at(-1)!.text;

    try {
      const systemPrompt = getSystemPrompt(professionals);
      const userPrompt = getUserPromptTemplate(input);

      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema
      )

      if (!result.success) {
        console.error('âŒ Failed to identify intent:', result.data);
        return {
          intent: 'unknown',
          error: 'Failed to identify intent',
        };
      }

      const intentData = result.data!
      console.log('âœ… Intent identified:', intentData);

      return {
        ...intentData,
      };
    } 
    catch (error) {
      console.error('âŒ Error in identifyIntent node:', error);
      return {
        ...state,
        intent: 'unknown',
        error: error instanceof Error ? error.message : 'Intent identification failed',
      };
    }
  };
}
