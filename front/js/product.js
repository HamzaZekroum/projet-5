//Get the id from The link

const site = window.location.href;
const url = new URL(site);
const productId = url.searchParams.get("id");
console.log(productId);


//Creat variable of 
const colorSelect = document.querySelector("#colors");
const quantitySelect = document.querySelector("#quantity");


getProduct();

//fetching

// Get Product from API
function getProduct() {
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => {
        return res.json();
    })

    // Répartition des données de l'API dans le DOM
    .then(async function (resultatAPI) {
        article = await resultatAPI;
        console.table(article);
        if (article){
            getPost(article);
        }
        
    })
    .catch((error) => {
        console.log("Erreur de la requête API");
    })
}


function getPost(article){
    // Insert image
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Insert "h1"
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;

    // Insert Price
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

    // Insert description
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

    // Insert Colors
    for (let colors of article.colors){
        console.table(colors);
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
    addToCart(article);
}






//Gestion du panier
function addToCart(article) {
    const btn_envoyerPanier = document.querySelector("#addToCart");

    //Ecouter le panier avec 2 conditions couleur non nulle et quantité entre 1 et 100
    btn_envoyerPanier.addEventListener("click", (event)=>{
        if (quantitySelect.value > 0 && quantitySelect.value <=100 && quantitySelect.value != 0 && colorSelect.value !== "" ){

    //Recupération du choix de la couleur
    let choixCouleur = colorSelect.value;
                
    //Recupération du choix de la quantité
    let choixQuantite = quantitySelect.value;

    //Récupération des options de l'article à ajouter au panier
    let optionsProduit = {
        idProduit: productId,
        couleurProduit: choixCouleur,
        quantiteProduit: Number(choixQuantite),
        
    };

    //Initialisation du local storage
    let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));

    //fenêtre pop-up
    const popupConfirmation =() =>{
        if(window.confirm(`le produit est ajouté à votre panier`)){
            window.location.href ="index.html";
        }
    }

    //Importation dans le local storage
    //Si le panier comporte déjà au moins 1 article
    if (produitLocalStorage) {
    const resultFind = produitLocalStorage.find(
        (el) => el.idProduit === productId && el.couleurProduit === choixCouleur);
        //Si le produit commandé est déjà dans le panier
        if (resultFind) {
            let newQuantite =
            parseInt(optionsProduit.quantiteProduit) + parseInt(resultFind.quantiteProduit);
            resultFind.quantiteProduit = newQuantite;
            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
            console.table(produitLocalStorage);
            popupConfirmation();
        //Si le produit commandé n'est pas dans le panier
        } else {
            produitLocalStorage.push(optionsProduit);
            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
            console.table(produitLocalStorage);
            popupConfirmation();
        }
    //Si le panier est vide
    } else {
        produitLocalStorage =[];
        produitLocalStorage.push(optionsProduit);
        localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
        console.table(produitLocalStorage);
        popupConfirmation();
    }}
    
    else{

        alert("veuillez remplir tous les champs obligatoires")
    }

    });
}