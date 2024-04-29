const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("adress")
const adressWarn =document.getElementById("adress-warn")

let cart = [];

//Abrir o modal do carrinho

cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
})

//Fechar o modal click fora

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//click item no carrinho

menu.addEventListener("click", function(event){
   
    let  parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name =  parentButton.getAttribute("data-name")
        const priceString = parentButton.getAttribute("data-price"); // Obter o preço como uma string
        const priceCleaned = priceString.replace(/[^\d.,]/g, ''); // Remover tudo exceto dígitos, pontos e vírgulas
        const price = parseFloat(priceCleaned.replace(',', '.')); // Converter a string limpa para um número de ponto flutuante
        addToCart(name, price)
    }
    
})

//Função adicionar item no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
    //Se o item ja existe, aumenta apenas a quantidade + 1    
        existingItem.quantify += 1;
        
    }else{
        cart.push({
            name,
            price,
            quantify: 1,
    })
        
}

updateCartModal()
}


//Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div> 
                    <p class="font-medium">${item.name}</p> <!-- Corrigido -->
                    <p>Qtd: ${item.quantify}</p> <!-- Corrigido -->
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div>


                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>

                </div>
            </div>
        `;
        total += item.price * item.quantify;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;

}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantify > 1){
            item.quantify -= 1;
            updateCartModal();
            return;

        }
        cart.splice(index, 1);
        updateCartModal();

    }
}

adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    console.log("Valor do campo de endereço:", inputValue); // Adiciona um console.log para verificar o valor do campo de endereço

    if(inputValue !== ""){
        adressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    
    if(!isOpen){

        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "bottom", // Define o aviso para aparecer na parte inferior
            position: "right", // Define o aviso para aparecer à direita
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
       


        return;
    }

    if(cart.length === 0) {
        console.log("O carrinho está vazio!");
        return;
    }

    if(adressInput.value === ""){
        console.log("O campo de endereço está vazio!");
        adressWarn.classList.remove("hidden"); // Exibir mensagem de erro
        adressInput.classList.add("border-red-500");
        return;
    }

     // ENVIAR O PEDIDO PARA API WHATS 
     const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantify}) Preço: R$${item.price}`;
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "16991475665";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank");
    cart= [];
    updateCartModal();

});



// Verificar a hora e manipular o Card horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    // Retorna true se o restaurante estiver aberto entre 18:00 e 21:59
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
