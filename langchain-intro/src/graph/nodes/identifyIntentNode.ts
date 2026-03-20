import { GraphState } from "../graph";

export function identifyIntentNode(state: GraphState): GraphState {
    const lastMessage = state.messages[state.messages.length - 1];
    // Add your intent identification logic here
    const intput = lastMessage.text.toLowerCase();

    let command: GraphState["command"] = "unknown";

    if (intput.includes("upper")) {
        command = "uppercase";
    }

    if (intput.includes("lower")) {
        command = "lowercase";
    }
   
    return {
        ...state,
        command,
        output: intput
    };

    console.log("Identified command:", command);
}