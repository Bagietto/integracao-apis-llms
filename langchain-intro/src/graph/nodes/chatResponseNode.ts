import { GraphState } from "../graph";
import { AIMessage } from "langchain";

export function chatResponseNode(state: GraphState): GraphState {
   const responseText = state.output;
   const aiMessage = new AIMessage(responseText);
   
    return {
        ...state,
        messages: [...state.messages, aiMessage],
    };
}