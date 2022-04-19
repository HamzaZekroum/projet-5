// Calculate
function calculateTotal() {
  let cart = JSON.parse(localStorage.getItem('produit'))
  let totalQuantity = document.querySelector('#totalQuantity')
  let totalPrice = document.querySelector('#totalPrice')

  totalQuantity.textContent = 0
  totalPrice.textContent = 0

  if(cart != null){
    cart.forEach(product => {
      fetch(`http://localhost:3000/api/products/${product.idProduit}`)
        .then(response => response.json())
        .then(data => {
          totalQuantity.textContent = Number(totalQuantity.textContent) + product.quantiteProduit
          totalPrice.textContent = (Number(totalPrice.textContent) + (product.quantiteProduit * data.price)).toFixed(2)
        })
        .catch(err => console.log(err))
    })
  }
  
}

//Initialisation du local storage
let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
const positionEmptyCart = document.querySelector("#cart__items");

if(produitLocalStorage != null){
  produitLocalStorage.forEach(produit => {

    fetch('http://localhost:3000/api/products/' + produit.idProduit)
      .then(response => response.json())
      .then(products => {

        document.querySelector("#cart__items").innerHTML += `
              <article class="cart__item" data-id="${produit.idProduit}" data-color="${produit.couleurProduit}">
              <div class="cart__item__img">
                <img src="${products.imageUrl}" alt="${products.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${products.name}</h2>
                  <p>${produit.couleurProduit}</p>
                  <p>${(products.price).toFixed(2)} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantiteProduit}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
          `
          
          // Modification d'une quantité de produit
          document.querySelectorAll(".itemQuantity").forEach(btn => {
            btn.addEventListener("change", () => {
        
              let panier = JSON.parse(localStorage.getItem('produit'))
              let newPanier = []
              let article = btn.closest('article')
              let color = article.getAttribute('data-color')
              let id = article.getAttribute('data-id')
        
              panier.forEach(produit => {
                if(produit.idProduit == id && produit.couleurProduit == color) {
                  produit.quantiteProduit = Number(article.querySelector('.itemQuantity').value)
                } 
                
                newPanier.push(produit)
                
              })
        
              localStorage.setItem('produit', JSON.stringify(newPanier))
              calculateTotal()
            })
          })
          
          // Suppression d'un produit
          document.querySelectorAll(".deleteItem").forEach(btn => {
            btn.addEventListener("click", () => {
        
              let panier = JSON.parse(localStorage.getItem('produit'))
              let newPanier = []
              let article = btn.closest('article')
              let color = article.getAttribute('data-color')
              let id = article.getAttribute('data-id')
        
              panier.forEach(produit => {
                if(produit.idProduit == id && produit.couleurProduit == color) {
                  article.remove()
                } else {
                  newPanier.push(produit)
                }
              })
        
              localStorage.setItem('produit', JSON.stringify(newPanier))
              calculateTotal()
            })
          })

      })
  });
}

calculateTotal()

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  event.stopPropagation()
})

document.querySelector('#order').addEventListener('click', () => {

  let form = document.querySelector("form")
  let panier = JSON.parse(localStorage.getItem('produit'))

  let error

  let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$')
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$")
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+")

  error = document.querySelector('#firstNameErrorMsg')
  charRegExp.test(form.firstName.value) ? error.textContent = '' : error.textContent = 'Veuillez renseigner ce champ.'

  error = document.querySelector('#lastNameErrorMsg')
  charRegExp.test(form.lastName.value) ? error.textContent = '' : error.textContent = 'Veuillez renseigner ce champ.'

  error = document.querySelector('#addressErrorMsg')
  addressRegExp.test(form.address.value) ? error.textContent = '' : error.textContent = 'Veuillez renseigner ce champ.'

  error = document.querySelector('#cityErrorMsg')
  charRegExp.test(form.city.value) ? error.textContent = '' : error.textContent = 'Veuillez renseigner ce champ.'

  error = document.querySelector('#emailErrorMsg')
  emailRegExp.test(form.email.value) ? error.textContent = '' : error.textContent = 'Veuillez renseigner ce champ.'

  if(

    charRegExp.test(form.firstName.value) &&
    charRegExp.test(form.lastName.value) &&
    addressRegExp.test(form.address.value) &&
    charRegExp.test(form.city.value) &&
    emailRegExp.test(form.email.value)
    
  ){

    let order = {
      contact: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
      },
      products: []
    }


    if(panier != null){
      panier.forEach(item => {
        order.products.push(item.idProduit)
      })

        fetch('http://localhost:3000/api/products/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => {
          localStorage.removeItem('produit')
          window.location.href = `./confirmation.html?orderId=${data.orderId}`
        })
        .catch(error => console.log(error))

    } else {
      alert('Veuillez remplir le panier avant de passer une commande !')
    }
    
  }


})
