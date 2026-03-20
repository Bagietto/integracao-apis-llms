import { AIMessage, SystemMessage } from "langchain";
import { GraphState } from "../graph.ts";

export function fallbackNode(state: GraphState): GraphState {
   const responseText = "Sorry, I didn't understand that command. Please try again.";
   const fallbackMessage = new AIMessage(responseText).content.toString();
    return {
        ...state,
         output: fallbackMessage,
        messages: [
            ...state.messages, 
            //new SystemMessage("Fallback response: " + fallbackMessage)
        ],
    };
}