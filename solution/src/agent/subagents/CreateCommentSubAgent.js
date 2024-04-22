import { isLoggedIn, ofRandom } from "../Util"

const createCommentSubAgent = (end) => {

    let stage;

    let comment, confirm;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            stage = "FOLLOWUP_COMMENT";
            return ofRandom([
                "Sure, what would you like to comment?",
                "Alright, what would you like to comment?"
            ])
        } else {
            return end(ofRandom([
                "You are already logged in, try logging out first.",
                "You are already signed in, try signing out first."
            ]))
            
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_COMMENT": return await handleFollowupComment(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);
        }
    }

    const handleFollowupComment = async (prompt) => {
        comment = prompt;
        stage = 'FOLLOWUP_CONFIRM';
        return ofRandom([
            "Sounds good, are you ready to post this comment?",
            "Great, are you ready to post this comment?"
        ])
    }

    const handleFollowupConfirm = async (prompt) => {
        confirm = prompt;
        if (confirm.toLowerCase().includes("yes")) {
            await fetch("https://cs571.org/api/s24/ice/comments", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comment: comment
                })
            })
            return end(ofRandom([
                "Your comment has been posted!",
                "Congrats, your comment has been posted!"
            ]));
        } else {
            return end(ofRandom([
                "No worries, if you want to create a comment in the future, just ask!",
                "That's alright, if you want to create a comment in the future, just ask!"
            ]))
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createCommentSubAgent;