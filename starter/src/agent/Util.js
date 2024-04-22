const ofRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const isLoggedIn = async () => {
    const resp = await fetch("https://cs571.org/api/s24/ice/whoami", {
        credentials: "include",
        headers: {
            "X-CS571-ID": CS571.getBadgerId()
        }
    })
    const body = await resp.json();
    return body.isLoggedIn;
}

export {
    ofRandom,
    isLoggedIn
}