//petit script node js pour les post



const fs = require('fs');
const path = require('path');

// Chemin vers le JSON
const postPath = path.join(__dirname, 'blog/post.json');

// Nouvel article à ajouter
const newPost = {
  id: null, // sera défini automatiquement
  title: "Titre de mon nouvel article",
  date: new Date().toISOString().split('T')[0], 
  cover: "image",
  tags: ["Tag1", "Tag2"],
  content: "contenu des post"
};

// Lecture du fichier existant
fs.readFile(postPath, 'utf8', (err, data) => {
  if (err) return console.error("Erreur lecture JSON:", err);

  let post;
  try {
    post = JSON.parse(data);
  } catch (e) {
    return console.error("Erreur parsing JSON:", e);
  }

  // Définir un nouvel ID
  const maxId = post.reduce((max, post) => Math.max(max, post.id), 0);
  newPost.id = maxId + 1;

  // Ajouter le nouvel article
  post.push(newPost);

  // Sauvegarder
  fs.writeFile(postPath, JSON.stringify(post, null, 2), 'utf8', (err) => {
    if (err) return console.error("Erreur écriture JSON:", err);
    console.log(`Article ajouté avec succès ! ID: ${newPost.id}`);
  });
});
