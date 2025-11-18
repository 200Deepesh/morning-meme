const saveSubscription = async (subscription) => {
    const SERVER_URL = "http://localhost:3000/api/subscription";
    const response = await fetch(SERVER_URL, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
    });
    return response;
};

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    switch (event.notification.tag) {
        case "friend_request": {
            switch (event.action) {
                case "accecpt": {
                    console.log("accecpt request API call.. with", event.notification.data.username)
                }
                    break;
                case "view": {
                    event.waitUntil(
                        clients
                            .matchAll({
                                type: "window",
                                includeUncontrolled: true,
                            })
                            .then((windowClients) => {
                                const matchingClient = windowClients.find(
                                    (wc) => wc.url === 'https://www.google.com/'
                                );

                                if (matchingClient) {
                                    return matchingClient.focus();
                                } else {
                                    return clients.openWindow('https://www.google.com/');
                                }
                            })
                    );
                }
                    break;
            }
        }
            break;
        default: console.error(`Not found: ${event.notification.tag}`);
    }
});

self.addEventListener("activate", async () => {
    try {
        const applicationServerKey = Uint8Array.fromBase64(
            "BE86fIv4aaRy-INIjXYlQA27kvbYVLJIho8iSEl374hD_ESbmAtNmjtJy4dkSX978Lb9yYGeal_TtkaCT9wXaTw",
            { alphabet: "base64url" }
        );
        const subscription = await self.registration.pushManager.subscribe({ applicationServerKey, userVisibleOnly: true });
        const res = await saveSubscription(subscription);
        console.log(res.status);
    } catch (error) {
        console.error(error);
    }
});

self.addEventListener("push", async (event) => {
    if (event.data) {
        self.registration.showNotification("Friend Request", JSON.parse(event.data.text()));
    } else {
        console.error("Push event but no data!!");
    }
});