// Configuration for New Light Library
const CONFIG = {
    siteName: 'နယူးလိုက်စာကြည့်တိုက်',
    adminPassword: 'library2026', // Change this in production
    analyticsId: 'NLL-2026',
    maxNewsItems: 100,
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    categories: [
        {id: 'library', name: 'စာကြည့်တိုက်'},
        {id: 'event', name: 'အခမ်းအနား'},
        {id: 'book', name: 'စာအုပ်သစ်'},
        {id: 'announcement', name: 'ကြေညာချက်'}
    ]
};

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
