// ======= État de l'application =======
let POSTS = [];
//let ADS = [];
let currentView = 'list';
let currentArticleId = null;
let filteredPosts = [];
let selectedTag = 'all';

// ======= Initialisation =======
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Charger les articles depuis JSON
    const postsResponse = await fetch('/blog/post.json');
    POSTS = await postsResponse.json();
    POSTS.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPosts = [...POSTS];

    // Charger les publicités depuis JSON
    //const adsResponse = await fetch('/blog/ads.json');
    //ADS = await adsResponse.json();

    generateTags();
    filterPosts();
    //renderAds();

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', filterPosts);
    document.getElementById('backButton').addEventListener('click', (e) => {
      e.preventDefault();
      showListView();
    });

    checkURL();
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});

// ======= Génération des tags =======
function generateTags() {
  const allTags = new Set();
  POSTS.forEach(post => post.tags.forEach(tag => allTags.add(tag)));

  const tagsFilter = document.getElementById('tagsFilter');
  // Bouton "Tous" déjà dans HTML
  POSTS.forEach(post => post.tags.forEach(tag => {
    if (!allTags.has(tag)) return;
    allTags.delete(tag); // pour éviter doublons
    const button = document.createElement('button');
    button.className = 'tag-filter';
    button.textContent = tag;
    button.dataset.tag = tag;
    button.addEventListener('click', () => {
      selectedTag = tag;
      updateActiveTag();
      filterPosts();
    });
    tagsFilter.appendChild(button);
  }));
}

// Mettre à jour l'état visuel des tags
function updateActiveTag() {
  document.querySelectorAll('.tag-filter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === selectedTag);
  });
}

// ======= Filtrage des articles =======
function filterPosts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  filteredPosts = POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  renderPosts();
}

// ======= Affichage des articles =======
function renderPosts() {
  const grid = document.getElementById('postsGrid');
  const noResults = document.getElementById('noResults');

  grid.innerHTML = '';

  if (!filteredPosts.length) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';

  filteredPosts.forEach(post => grid.appendChild(createPostCard(post)));
}

function createPostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.onclick = () => showArticleView(post.id);

  const excerpt = post.content.split('\n').find(line => line.length > 50 && !line.startsWith('#')) 
                  || 'Cliquez pour lire la suite...';

  card.innerHTML = `
    <img src="${post.cover}" alt="${post.title}" class="post-cover" loading="lazy">
    <div class="post-content">
      <h2 class="post-title">${post.title}</h2>
      <div class="post-meta">📅 <time>${formatDate(post.date)}</time></div>
      <div class="post-tags">${post.tags.map(tag => `<span class="tag">🏷️ ${tag}</span>`).join('')}</div>
      <p class="post-excerpt">${excerpt}</p>
    </div>
  `;
  return card;
}

// ======= Affichage article individuel =======
function showArticleView(postId) {
  const post = POSTS.find(p => p.id === postId);
  if (!post) return;

  currentArticleId = postId;
  currentView = 'article';

  document.getElementById('listView').style.display = 'none';
  document.getElementById('articleView').classList.add('active');

  renderArticle(post);
  renderArticleNavigation(postId);
  window.scrollTo(0, 0);
  window.history.pushState({ postId }, '', `?article=${postId}`);
}

function showListView() {
  currentView = 'list';
  currentArticleId = null;

  document.getElementById('listView').style.display = 'block';
  document.getElementById('articleView').classList.remove('active');
  window.history.pushState({}, '', window.location.pathname);
  window.scrollTo(0, 0);
}

function renderArticle(post) {
  const content = document.getElementById('articleContent');
  content.innerHTML = `
    <div class="article-header">
      <img src="${post.cover}" alt="${post.title}" class="article-cover">
      <h1 class="article-title">${post.title}</h1>
      <div class="post-meta">📅 <time>${formatDate(post.date)}</time></div>
      <div class="post-tags">${post.tags.map(tag => `<span class="tag">🏷️ ${tag}</span>`).join('')}</div>
    </div>
    <div class="article-body">${marked.parse(post.content)}</div>
  `;
}

// ======= Navigation entre articles =======
function renderArticleNavigation(currentId) {
  const currentIndex = POSTS.findIndex(p => p.id === currentId);
  const nav = document.getElementById('articleNav');
  nav.innerHTML = '';

  // Article précédent
  if (currentIndex > 0) {
    const prevPost = POSTS[currentIndex - 1];
    nav.appendChild(createNavLink(prevPost, 'prev', '← Article précédent'));
  } else nav.appendChild(document.createElement('button'));

  // Article suivant
  if (currentIndex < POSTS.length - 1) {
    const nextPost = POSTS[currentIndex + 1];
    nav.appendChild(createNavLink(nextPost, 'next', 'Article suivant →'));
  } else nav.appendChild(document.createElement('button'));
}

function createNavLink(post, cls, text) {
  const link = document.createElement('a');
  link.href = '#';
  link.className = `nav-article ${cls}`;
  link.textContent = text;
  link.onclick = (e) => {
    e.preventDefault();
    showArticleView(post.id);
  };
  return link;
}

// ======= Affichage publicités =======
/*
function renderAds() {
  const adsGrid = document.getElementById('adsGrid');
  adsGrid.innerHTML = '';

  ADS.forEach(ad => {
    const adCard = document.createElement('a');
    adCard.href = ad.url;
    adCard.className = 'ad-card';
    adCard.innerHTML = `
      <img src="${ad.image}" alt="${ad.text}" class="ad-image" loading="lazy">
      <div class="ad-text">${ad.text}</div>
    `;
    adsGrid.appendChild(adCard);
  });
}
*/
// ======= Utilitaires =======
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function checkURL() {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('article');
  if (articleId) showArticleView(parseInt(articleId));
}

// Bouton retour navigateur
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.postId) showArticleView(e.state.postId);
  else showListView();
});

