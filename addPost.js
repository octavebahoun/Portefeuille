//petit script node js pour les posts



const fs = require('fs');
const path = require('path');

// Chemin vers le JSON
const postsPath = path.join(__dirname, 'static/json/posts.json');

// Nouvel article à ajouter
const newPost = {
  id: null, // sera défini automatiquement
  title: "Titre de mon nouvel article",
  date: new Date().toISOString().split('T')[0], 
  cover: "image",
  tags: ["Tag1", "Tag2"],
  content: "contenu des posts"
};

// Lecture du fichier existant
fs.readFile(postsPath, 'utf8', (err, data) => {
  if (err) return console.error("Erreur lecture JSON:", err);

  let posts;
  try {
    posts = JSON.parse(data);
  } catch (e) {
    return console.error("Erreur parsing JSON:", e);
  }

  // Définir un nouvel ID
  const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
  newPost.id = maxId + 1;

  // Ajouter le nouvel article
  posts.push(newPost);

  // Sauvegarder
  fs.writeFile(postsPath, JSON.stringify(posts, null, 2), 'utf8', (err) => {
    if (err) return console.error("Erreur écriture JSON:", err);
    console.log(`Article ajouté avec succès ! ID: ${newPost.id}`);
  });
});
