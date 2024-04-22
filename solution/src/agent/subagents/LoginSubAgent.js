import { isLoggedIn, ofRandom } from "../Util"

const createLoginSubAgent = (end) => {

    let stage;

    let username, password;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end(ofRandom([
                "You are already logged in, try logging out first.",
                "You are already signed in, try signing out first."
            ]))
        } else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([
                "Sure, what is your username?",
                "Alright, what is your username?"
            ])
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return ofRandom([
            "Great, and what is your password?",
            "Thanks, and what is your password?"
        ])
    }

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        const resp = await fetch("https://cs571.org/api/s24/ice/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        
        if (resp.status === 200) {
            return end(ofRandom([
                "Successfully logged in!",
                "Success! You have been logged in."
            ]))
        } else {
            return end(ofRandom([
                "Sorry, that username and password is incorrect.",
                "Sorry, your username or password is incorrect.",
            ]))
        }      
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;