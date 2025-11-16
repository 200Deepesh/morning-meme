const subscribeBtn = document.getElementById('sub-btn');
const notificationBtn = document.getElementById('not-btn');

notificationBtn.style.display = (Notification.permission == "granted") ? "block" :"hidden";

const askNotificationPermission = () => {
    if (!("Notification" in window)) {
        throw new Error("Your browser does not support push notification");
    }
    Notification
        .requestPermission()
        .then((permission) => {
            if (permission == "granted") {
                sendNotification("Morning Meme", "Get ready to add more humor in your life!!");
                notificationBtn.style.display = "block";
            }
        });
}

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                "./scripts/service-worker.js",
                {
                    scope: "/scripts/",
                },
            );
            return registration;
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
}

const sendNotification = async (title, body, icon) => {
    const options = {
        body,
        icon,
        data: {requestId: 123, username: "Elon@221"},
        actions: [
            {
                action: "accecpt",
                title: "Accecpt",
            },
            {
                action: "view",
                title: "View",
            },
        ],
        tag: "friend_request",
    };
    const sw = await registerServiceWorker();
    sw.showNotification(title, options);

}
subscribeBtn.addEventListener('click', askNotificationPermission);
notificationBtn.addEventListener('click', (e) => sendNotification("Morning Meme", "Get ready to add more humor in your life!!"));



setTimeout(() => {
    sendNotification("Morning Meme", "Get ready to add more humor in your life!!", "https://static.vecteezy.com/system/resources/previews/029/140/204/original/happy-emoji-happy-emoji-happy-emoji-transparent-background-ai-generative-free-png.png");
}, 3000)