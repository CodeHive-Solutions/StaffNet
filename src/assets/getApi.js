// getApi.js
export const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === "staffnet.cyc-bpo.com") {
        return "https://staffnet-api.cyc-bpo.com";
    } else if (hostname === "staffnet-dev.cyc-bpo.com") {
        return "https://staffnet-api-dev.cyc-bpo.com";
    } else {
        return "https://staffnet-api-dev.cyc-bpo.com";
    }
};
