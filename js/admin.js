// Admin JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    loadAnalytics();
    loadStatistics();
});

// Sample data storage (In real scenario, use localStorage or backend API)
let newsData = JSON.parse(localStorage.getItem('libraryNews')) || [];
let analyticsData = JSON.parse(localStorage.getItem('libraryAnalytics')) || {
    totalVisitors: 1234,
    todayVisitors: 56,
    countries: [
        {name: 'မြန်မာ', count: 800},
        {name: 'ထိုင်း', count: 200},
        {name: 'စင်ကာပူ', count: 100},
        {name: 'ဂျပန်', count: 50},
        {name: 'အမေရိကန်', count: 84}
    ],
    popularNews: [
        {title: 'စာအုပ်စင် အသစ်များ ရောက်ရှိ', views: 150},
        {title: 'စာဖတ်ပရိတ်သတ် ဆုချီးမြှင့်ပွဲ', views: 120},
        {title: 'ညနေ ၆နာရီအထိ ဖွင့်လှစ်မည်', views: 95}
    ]
};

function loadStatistics() {
    document.getElementById('total-visitors').textContent = analyticsData.totalVisitors.toLocaleString();
    document.getElementById('today-visitors').textContent = analyticsData.todayVisitors;
    document.getElementById('total-news').textContent = newsData.length;
    document.getElementById('total-photos').textContent = '156'; // This should be dynamic
}

function loadNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    
    newsData.forEach((news, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${news.title}</td>
            <td>${news.date}</td>
            <td><span class="badge bg-primary">${news.category}</span></td>
            <td>${news.views || 0}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editNews(${index})">တည်းဖြတ်</button>
                <button class="btn btn-sm btn-danger" onclick="deleteNews(${index})">ဖျက်မည်</button>
            </td>
        `;
        newsList.appendChild(row);
    });
}

function loadAnalytics() {
    const countryList = document.getElementById('country-list');
    const popularNews = document.getElementById('popular-news');
    
    // Load countries
    countryList.innerHTML = '';
    analyticsData.countries.forEach(country => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            ${country.name}
            <span class="badge bg-primary rounded-pill">${country.count}</span>
        `;
        countryList.appendChild(item);
    });
    
    // Load popular news
    popularNews.innerHTML = '';
    analyticsData.popularNews.forEach(news => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            ${news.title}
            <span class="badge bg-success rounded-pill">${news.views}</span>
        `;
        popularNews.appendChild(item);
    });
}

function saveNews() {
    const title = document.getElementById('newsTitle').value;
    const category = document.getElementById('newsCategory').value;
    const content = document.getElementById('newsContent').value;
    const image = document.getElementById('newsImage').value;
    
    if (!title || !content) {
        alert('ကျေးဇူးပြု၍ ခေါင်းစဉ်နှင့် အကြောင်းအရာ ဖြည့်စွက်ပါ။');
        return;
    }
    
    const newNews = {
        id: Date.now(),
        title: title,
        category: category,
        content: content,
        image: image || 'https://via.placeholder.com/400x250?text=Library+News',
        date: new Date().toLocaleDateString('my-MM'),
        views: 0
    };
    
    newsData.unshift(newNews);
    localStorage.setItem('libraryNews', JSON.stringify(newsData));
    
    // Reset form
    document.getElementById('newsForm').reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addNewsModal'));
    modal.hide();
    
    // Reload news list
    loadNews();
    
    alert('သတင်းကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။');
}

function editNews(index) {
    const news = newsData[index];
    if (confirm(`"${news.title}" ကို တည်းဖြတ်မည်။`)) {
        // In real implementation, open edit modal
        alert('တည်းဖြတ်ခြင်း လုပ်ဆောင်ရန် ပြင်ဆင်နေပါသည်။');
    }
}

function deleteNews(index) {
    if (confirm('ဤသတင်းကို ဖျက်မည်မှာ သေချာပါသလား?')) {
        newsData.splice(index, 1);
        localStorage.setItem('libraryNews', JSON.stringify(newsData));
        loadNews();
        alert('သတင်းကို ဖျက်ပြီးပါပြီ။');
    }
}

// Simulate visitor tracking
function trackVisitor() {
    analyticsData.totalVisitors++;
    analyticsData.todayVisitors++;
    localStorage.setItem('libraryAnalytics', JSON.stringify(analyticsData));
}
