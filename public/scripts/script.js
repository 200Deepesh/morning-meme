const subscribeBtn = document.getElementById('subscribe-btn');
const notificationBtn = document.getElementById('not-btn');

notificationBtn.style.display = (Notification.permission == "granted") ? "block" : "none";
subscribeBtn.style.display = (Notification.permission == "granted") ? "none" : "block";

const askNotificationPermission = () => {
    if (!("Notification" in window)) {
        alert("Your browser does not support notification.");
    }
    Notification
        .requestPermission()
        .then((permission) => {
            if (permission == "granted") {
                // sendNotification("Morning Meme", "Get ready to add more humor in your life!!");
                const sw = registerServiceWorker();
                if(sw){
                    alert("Get ready to make you morning more funny!!");
                    notificationBtn.style.display = "block";
                    subscribeBtn.style.display = "none";
                }
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

const sendNotification = async (title, body, image) => {
    const options = {
        body,
        image: image || "http://localhost:3000/assets/elonmusk.jpg",
        data: { requestId: 123, username: "Elon@221" },
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
notificationBtn.addEventListener('click', (e) => sendNotification("Morning Meme", "Get ready to add more humor in your life!!", "http://localhost:3000/assets/elonmusk.jpg"));


