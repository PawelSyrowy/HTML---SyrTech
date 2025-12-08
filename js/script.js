loadComponent("site-header", "components/header.html", () => {
    if (!document.querySelector('script[src="components/header.js"]')) {
        const script = document.createElement("script");
        script.src = "components/header.js";
        script.onload = initHeader;
        document.body.appendChild(script);
    } else {
        initHeader();
    }
});
