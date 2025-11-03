export const getSEOSuggestions = (metrics) => {
    const suggestions = [];

    if (metrics.bounceRate > 50) {
        suggestions.push("Reduce bounce rate by improving content engagement.");
    }
    if (metrics.pageLoadTime > 3) {
        suggestions.push("Optimize page load time by compressing images and using caching.");
    }
    if (!metrics.isMobileFriendly) {
        suggestions.push("Ensure mobile responsiveness for better SEO performance.");
    }
    return suggestions;
};
