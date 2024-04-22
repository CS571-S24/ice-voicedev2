import { isLoggedIn, ofRandom } from "../Util"

const createLoginSubAgent = (end) => {

    let stage;

    const handleInitialize = async (promptData) => {
        return end("I should handle logging in!");
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        
    }

    const handleFollowupPassword = async (prompt) => {
        
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;