const ADMIN_USER = "maria";
const ADMIN_PASS = "1234"; 

let products = JSON.parse(localStorage.getItem('products')) ||  []; 
let isAdmin =false;

// elementos del DOM 
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section'); 
const productGrid = document.getElementById('products-grid');
const btnShowLogin = document.getElementById('btn-show-login');
const btnLogout = document.getElementById('btn-logout');
const btnsave = document.getElementById('btnsave');
const productForm = document.getElementById('product-form');
const CUOPON_CODE = "DESC50";


// validacion simple 

btnShowLogin.addEventListener('click',()=> {
    loginSection.classList.toggle ('hidden')
}); 

// validar contraseña y usuario

document.getElementById('btn-login').addEventListener('click', () => {
    const user = document.getElementById('user-input').value.trim();
    const pass = document.getElementById('pass-input').value.trim();

    
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        isAdmin = true; 
        loginSection.classList.add('hidden');    
        adminSection.classList.remove('hidden'); 
        btnShowLogin.classList.add('hidden');    
        btnLogout.classList.remove('hidden');   
        renderProducts(); 
    } else {
        
        document.getElementById('login-error').classList.remove('hidden');
    }
});  
       btnLogout.addEventListener('click', ()=> {
        isAdmin= false; 
        adminSection.classList.add('hidden');
        btnLogout.classList.add('hidden');
        btnShowLogin.classList.remove('hidden');
        renderProducts();

       })

   //guardar productos //
   
   productForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const img = document.getElementById('prod-img').value.trim();
    const editIndex = document.getElementById('edit-index').value
    const coupon = document.getElementById('aplicar-cupon').value.trim().toUpperCase(); 
    
    let finalprice =price;
    let hasDiscount =false; 
    //aplicar cupon //
    if (coupon=== CUOPON_CODE){
        finalprice= price * 0.5;
        hasDiscount =true;
    }
    const product = {
        name,
        price: finalprice,
        originalPrice: price,
        img,
        hasDiscount
    };
    if(editIndex=== ""){
        products.push(product);
    } else{ 
        products[editIndex]=product;

    }
    saveAndrender();
    
    productForm.reset();
    document.getElementById('edit-index').value ="";

   });
   function deleteProduct(index){
    if(confirm("¿eliminar este producto?")){
        products.splice(index,1); 

        saveAndrender();
    }

   }


   function editProduct(index){
    const prod = products[index];
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-price').value = prod.originalPrice || prod.price;
    document.getElementById('prod-img').value = prod.img;
    document.getElementById('edit-index').value = index;
    window.scrollTo(0,0);
   }
   function saveAndrender(){
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();

   }
   // DOM 

function renderProducts(){
    productGrid.innerHTML = '';

    products.forEach((prod,index)=> {
        const card =document.createElement('div');
        card.className ='card';

        card.innerHTML = `
         <img src="${prod.img}" alt="${prod.name}"
         loading ="lazy"
         onerror="this.src='https://via.placeholder.com/300*150? text=sin+imagen'"
         style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
        
        <h4>${prod.name}</h4>
        
        ${
            prod.hasDiscount
            ?` <p style="text-decoration:line-through;color:red;">$${prod.originalPrice}</p>
            <p style="color:green;">$${prod.price}</p>`
          :  `<p>$${prod.price}</p>`
          `<p><strong>precio:</strong>$${prod.price}</p>`
        }
        
        ${isAdmin ?`
            
            <button onclick= "editProduct(${index})">editar</button>
            <button onclick ="deleteProduct(${index})">eliminar</button>`:''


        }`;
        productGrid.appendChild(card);

    })

}

// carga inicial al abrir la pagina
renderProducts();

