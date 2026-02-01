// script.js
document.addEventListener('DOMContentLoaded', function() {
    // သတင်းဒေတာ ခေါ်ယူခြင်း
    fetch('data/news.json')
        .then(response => response.json())
        .then(newsData => {
            displayNews(newsData);
            setupFilters(newsData);
            populateSidebar(newsData);
        })
        .catch(error => console.error('သတင်းများ ခေါ်ယူရာတွင် အမှားတစ်ခုဖြစ်နေ:', error));

    // သတင်းများကို ပြသခြင်း
    function displayNews(newsArray) {
        const newsGrid = document.getElementById('newsGrid');
        const featuredContainer = document.getElementById('featuredNews');
        newsGrid.innerHTML = '';
        
        // နောက်ဆုံးရ သတင်းများကို ရက်စွဲအလိုက် စီပါ
        newsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // ထိပ်တန်းသတင်းများ (အသစ်ဆုံး ၃ ခု)
        const featuredNews = newsArray.slice(0, 3);
        featuredContainer.innerHTML = featuredNews.map((news, index) => `
            <div class="featured-item ${index === 0 ? 'large' : 'small'}">
                <img src="${news.image}" alt="${news.title}">
                <div class="featured-content">
                    <span class="category-tag">${news.category}</span>
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                    <div class="date">${formatDate(news.date)}</div>
                </div>
            </div>
        `).join('');
        
        // သတင်းများ ဇယား
        newsArray.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <img src="${news.image}" alt="${news.title}">
                <div class="card-content">
                    <span class="category-tag">${news.category}</span>
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                    <div class="date">${formatDate(news.date)}</div>
                    <button class="read-more" onclick="openNewsDetail(${news.id})">ဆက်ဖတ်ရန်</button>
                </div>
            `;
            newsGrid.appendChild(newsCard);
        });
    }

    // စစ်ထုတ်ခြင်း လုပ်ဆောင်ချက်များ
    function setupFilters(newsData) {
        const yearFilter = document.getElementById('yearFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const searchBox = document.getElementById('searchBox');
        
        // နှစ်များစာရင်း
        const years = [...new Set(newsData.map(news => news.date.split('-')[0]))].sort((a,b) => b-a);
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year} ခုနှစ်`;
            yearFilter.appendChild(option);
        });
        
        // ကဏ္ဍများစာရင်း
        const categories = [...new Set(newsData.map(news => news.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // ဘေးဘားကဏ္ဍများအတွက်
        const categoryMenu = document.getElementById('categoryMenu');
        const sidebarCategories = document.getElementById('sidebarCategories');
        categories.forEach(category => {
            // ကဏ္ဍ Dropdown Menu
            const menuItem = document.createElement('a');
            menuItem.href = `#${category}`;
            menuItem.textContent = category;
            menuItem.onclick = (e) => {
                e.preventDefault();
                filterByCategory(category);
            };
            categoryMenu.appendChild(menuItem);
            
            // ဘေးဘားကဏ္ဍစာရင်း
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="#${category}" onclick="filterByCategory('${category}')">${category}</a>`;
            sidebarCategories.appendChild(listItem);
        });
        
        // ဘေးဘားနှစ်များအတွက်
        const sidebarYears = document.getElementById('sidebarYears');
        years.forEach(year => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="#${year}" onclick="filterByYear(${year})">${year} ခုနှစ်</a>`;
            sidebarYears.appendChild(listItem);
        });
        
        // Filter Event Listeners
        yearFilter.addEventListener('change', () => applyFilters(newsData));
        categoryFilter.addEventListener('change', () => applyFilters(newsData));
        searchBox.addEventListener('input', () => applyFilters(newsData));
    }
    
    function applyFilters(newsData) {
        const selectedYear = document.getElementById('yearFilter').value;
        const selectedCategory = document.getElementById('categoryFilter').value;
        const searchTerm = document.getElementById('searchBox').value.toLowerCase();
        
        let filteredNews = newsData;
        
        if (selectedYear) {
            filteredNews = filteredNews.filter(news => news.date.startsWith(selectedYear));
        }
        
        if (selectedCategory) {
            filteredNews = filteredNews.filter(news => news.category === selectedCategory);
        }
        
        if (searchTerm) {
            filteredNews = filteredNews.filter(news => 
                news.title.toLowerCase().includes(searchTerm) || 
                news.summary.toLowerCase().includes(searchTerm) ||
                news.content.toLowerCase().includes(searchTerm)
            );
        }
        
        displayNews(filteredNews);
    }
    
    function populateSidebar(newsData) {
        // ဘေးဘားကဏ္ဍများ
        const categories = [...new Set(newsData.map(news => news.category))];
        const categoryList = document.getElementById('sidebarCategories');
        categoryList.innerHTML = categories.map(category => 
            `<li><a href="#${category}" onclick="filterByCategory('${category}')">${category}</a></li>`
        ).join('');
        
        // ဘေးဘားနှစ်များ
        const years = [...new Set(newsData.map(news => news.date.split('-')[0]))].sort((a,b) => b-a);
        const yearList = document.getElementById('sidebarYears');
        yearList.innerHTML = years.map(year => 
            `<li><a href="#${year}" onclick="filterByYear(${year})">${year} ခုနှစ်</a></li>`
        ).join('');
    }
    
    // အထွေထွေ လုပ်ဆောင်ချက်များ
    window.filterByCategory = function(category) {
        document.getElementById('categoryFilter').value = category;
        applyFilters(newsData);
    };
    
    window.filterByYear = function(year) {
        document.getElementById('yearFilter').value = year;
        applyFilters(newsData);
    };
    
    window.openNewsDetail = function(newsId) {
        alert(`သတင်းအပြည့်အစုံကို ဖော်ပြရန် (ID: ${newsId})\nနောင်တွင် သီးသန့်စာမျက်နှာဖွင့်နိုင်ရန် ပြုလုပ်သွားမည်။`);
        // နောင်တွင် news-detail.html?newsId=1 ကဲ့သို့ သီးသန့်စာမျက်နှာဖွင့်နိုင်ရန်
    };
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('my-MM', options);
    }
});
