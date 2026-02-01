// News Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    trackVisitor();
    loadNews();
    initCharts();
    setupFilters();
});

// Load news from localStorage
function loadNews() {
    const newsGrid = document.getElementById('newsGrid');
    const newsData = JSON.parse(localStorage.getItem('libraryNews')) || getDefaultNews();
    
    newsGrid.innerHTML = '';
    
    if (newsData.length === 0) {
        newsGrid.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    သတင်းများ မရှိသေးပါ။ ကျေးဇူးပြု၍ နောက်မှ ထပ်ကြည့်ပါ။
                </div>
            </div>
        `;
        return;
    }
    
    newsData.forEach(news => {
        const categoryText = getCategoryText(news.category);
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="news-card">
                <div class="position-relative">
                    <img src="${news.image}" alt="${news.title}" class="news-img">
                    <span class="category-badge badge bg-primary">${categoryText}</span>
                </div>
                <div class="news-content">
                    <h5>${news.title}</h5>
                    <p class="text-muted small">${news.date}</p>
                    <p>${news.content.substring(0, 100)}...</p>
                    <a href="javascript:void(0)" onclick="viewNewsDetail(${news.id})" 
                       class="btn btn-sm btn-outline-primary">ဆက်ဖတ်ရန်</a>
                    <span class="float-end text-muted">
                        <i class="bi bi-eye"></i> ${news.views || 0}
                    </span>
                </div>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}

// Default news if no data exists
function getDefaultNews() {
    return [
        {
            id: 1,
            title: 'စာအုပ်စင် အသစ်များ ရောက်ရှိ',
            category: 'library',
            content: 'စာကြည့်တိုက်အတွင်း စာအုပ်စင်အသစ်များ တပ်ဆင်ပြီးစီးပါပြီ။ စာအုပ်စင် ၁၀ လုံးကို စာအုပ်စာပေများ စနစ်တကျထားရှိနိုင်ရန် တပ်ဆင်ထားပါသည်။',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
            date: '၂၀၂၆-၀၁-၁၅',
            views: 150
        },
        {
            id: 2,
            title: 'စာဖတ်ပရိတ်သတ် ဆုချီးမြှင့်ပွဲ',
            category: 'event',
            content: 'နှစ်ပတ်လည် စာဖတ်ပရိတ်သတ် ဆုချီးမြှင့်ပွဲကို ဇန်နဝါရီလ ၃၀ ရက်နေ့တွင် ကျင်းပမည်ဖြစ်သည်။',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w-400&h=250&fit=crop',
            date: '၂၀၂၆-၀၁-၁၀',
            views: 120
        }
    ];
}

function getCategoryText(category) {
    const categories = {
        'library': 'စာကြည့်တိုက်',
        'event': 'အခမ်းအနား',
        'book': 'စာအုပ်သစ်',
        'announcement': 'ကြေညာချက်'
    };
    return categories[category] || category;
}

// Track visitor
function trackVisitor() {
    let analytics = JSON.parse(localStorage.getItem('libraryAnalytics')) || {
        totalVisitors: 1234,
        todayVisitors: 56,
        countries: [
            {name: 'မြန်မာ', count: 800},
            {name: 'ထိုင်း', count: 200},
            {name: 'စင်ကာပူ', count: 100}
        ]
    };
    
    analytics.totalVisitors++;
    localStorage.setItem('libraryAnalytics', JSON.stringify(analytics));
    
    document.getElementById('totalVisitors').textContent = analytics.totalVisitors.toLocaleString();
}

// Initialize charts
function initCharts() {
    const analytics = JSON.parse(localStorage.getItem('libraryAnalytics')) || {
        countries: [
            {name: 'မြန်မာ', count: 800},
            {name: 'ထိုင်း', count: 200},
            {name: 'စင်ကာပူ', count: 100},
            {name: 'ဂျပန်', count: 50},
            {name: 'အမေရိကန်', count: 84}
        ]
    };
    
    // Country Chart
    const countryCtx = document.getElementById('countryChart').getContext('2d');
    new Chart(countryCtx, {
        type: 'bar',
        data: {
            labels: analytics.countries.map(c => c.name),
            datasets: [{
                label: 'ကြည့်ရှုသူ',
                data: analytics.countries.map(c => c.count),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Category Chart
    const newsData = JSON.parse(localStorage.getItem('libraryNews')) || getDefaultNews();
    const categoryCounts = {};
    newsData.forEach(news => {
        categoryCounts[news.category] = (categoryCounts[news.category] || 0) + 1;
    });
    
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryCounts).map(getCategoryText),
            datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    searchInput.addEventListener('input', filterNews);
    categoryFilter.addEventListener('change', filterNews);
}

function filterNews() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    const newsData = JSON.parse(localStorage.getItem('libraryNews')) || getDefaultNews();
    const newsGrid = document.getElementById('newsGrid');
    
    const filteredNews = newsData.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(searchTerm) || 
                             news.content.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    // Re-render filtered news
    newsGrid.innerHTML = '';
    filteredNews.forEach(news => {
        const categoryText = getCategoryText(news.category);
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="news-card">
                <div class="position-relative">
                    <img src="${news.image}" alt="${news.title}" class="news-img">
                    <span class="category-badge badge bg-primary">${categoryText}</span>
                </div>
                <div class="news-content">
                    <h5>${news.title}</h5>
                    <p class="text-muted small">${news.date}</p>
                    <p>${news.content.substring(0, 100)}...</p>
                    <a href="javascript:void(0)" onclick="viewNewsDetail(${news.id})" 
                       class="btn btn-sm btn-outline-primary">ဆက်ဖတ်ရန်</a>
                    <span class="float-end text-muted">
                        <i class="bi bi-eye"></i> ${news.views || 0}
                    </span>
                </div>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}

function viewNewsDetail(id) {
    // Increment view count
    let newsData = JSON.parse(localStorage.getItem('libraryNews')) || getDefaultNews();
    const newsIndex = newsData.findIndex(news => news.id === id);
    if (newsIndex !== -1) {
        newsData[newsIndex].views = (newsData[newsIndex].views || 0) + 1;
        localStorage.setItem('libraryNews', JSON.stringify(newsData));
    }
    
    // Show news detail (simplified)
    const news = newsData.find(news => news.id === id);
    if (news) {
        alert(`သတင်းအပြည့်အစုံ\n\n${news.title}\n\n${news.content}`);
    }
}
