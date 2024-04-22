import { isLoggedIn, ofRandom } from "../Util"

const createCommentSubAgent = (end) => {

    let stage;

    const handleInitialize = async (promptData) => {
        return end("I should handle creating a comment!");
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_COMMENT": return await handleFollowupComment(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);
        }
    }

    const handleFollowupComment = async (prompt) => {
        
    }

    const handleFollowupConfirm = async (prompt) => {
        
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createCommentSubAgent;