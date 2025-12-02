const subscribeBtn = document.getElementById('subscribe-btn');
const unsubscribeBtn = document.getElementById('unsubscribe-btn');

const isSubscriber = Notification.permission == "granted" && "active" == await cookieStore.get("status").then((s) => s?.value);

unsubscribeBtn.style.display = (isSubscriber) ? "block" : "none";
subscribeBtn.style.display = (isSubscriber) ? "none" : "block";

const askNotificationPermission = () => {
    if (!("Notification" in window)) {
        return alert("Your browser does not support notification.");
    }
    Notification
        .requestPermission()
        .then(async (permission) => {
            if (permission == "granted") {
                // sendNotification("Morning Meme", "Get ready to add more humor in your life!!");
                const sw = await registerServiceWorker();
                if (sw) {
                    alert("Get ready to make your morning more funny!!");
                    unsubscribeBtn.style.display = "block";
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
            // console.error(`Registration failed with following error:\n${error}`);
            alert("Some thing went wrong. Please try again later!!");
        }
    }
}

const subscribeUser = async () => {
    const status = await cookieStore.get("status").then((s) => s?.value);
    const subId = await cookieStore.get("subId").then((s) => s?.value);
    if(!subId){
        askNotificationPermission();
    }
    else if(status != "active"){
        const res = await fetch("http://localhost:3000/api/subscription", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "active" }),
        });
        if (!res.ok) {
            alert("Fail to subscribe. Please try again later!!");
        } else {
            alert("You can unsubscribe us again, any time any were.");
            unsubscribeBtn.style.display = "block";
            subscribeBtn.style.display = "none";
        }
    }
}

const unsubscribeUser = async () => {
    const res = await fetch("http://localhost:3000/api/subscription", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "inactive" }),
    });
    if (!res.ok) {
        alert("Fail to unsubscribe. Please try again later!!");
    } else {
        alert("You can subscribe us again, any time any were.");
        unsubscribeBtn.style.display = "none";
        subscribeBtn.style.display = "block";
    }
}



subscribeBtn.addEventListener('click', subscribeUser);
unsubscribeBtn.addEventListener('click', unsubscribeUser);


