let glassesList = [] ,
    basketList = [] ,
    heartList = [] ;


// toastr (uyarı-bilgilendirme) kodlarının görünüm özelliklerinin kodları

toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-bottom-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
    };

//Sepet bölümünün açılır kapanır modal kodu

const toggleModal = () => {
    const basketModalEl = document.querySelector(".basket_modal");
    basketModalEl.classList.toggle("active");
};

//Beğenilenler bölümünün açılır kapanır modal kodu

const toggleModalHeart = () => {
    const heartModalEl = document.querySelector(".heart_modal");
    heartModalEl.classList.toggle("active");
};

//Üyelik/Giriş bölümünün açılır kapanır modal kodu

const toggleModalPerson = () => {
    const personModalEl = document.querySelector(".person_modal");
    personModalEl.classList.toggle("active");
};

//popular.json dosyasındaki gözlük modellerinin data base'ye çekilme kodu

const getGlasses = () => {
    fetch ("./popular.json")
    .then((res) => res.json())
    .then((glasses) => (glassesList = glasses));
};

getGlasses();


//Anasayfadaki gözlüklerin dinamik hale getirilme kodları 

const createPopularGlassesItemHtml = () => {
    const glassesListEl = document.querySelector(".glasseslist");
    let glassesListHtml = "";
    glassesList.forEach(glass => {
        glassesListHtml += `<div class="card glasses_card">
        <div class="glasses_img">
            <img src="${glass.imgSource}" alt="Calvin Klein">
            <div class="heart">
                <button id="changeColorHeart"><i class="bi bi-heart-fill" onclick="addGlassToHeart(${glass.id})"></i></button>
            </div>
        </div>
        <div class="glasses_detail">
            <span class="glasses_name">${glass.name}</span>
            <span class="glasses_explanation">${glass.author}</span>
        </div>
        <div class="glasses_price">
            <span class="now_price">${glass.price} TL</span>
            <span class="old_price">${glass.oldPrice} TL</span>
        </div>
        <button class="btn_main" onclick="addGlassToBasket(${glass.id})">SEPETE EKLE</button>
    </div>`;
    });
    glassesListEl.innerHTML = glassesListHtml ;
};

//Sepet bölümündeki gözlüklerin dinamik hale getirilme ve listelenme kodları

const listBasketItems = () => {
    const basketListEl = document.querySelector(".basket_list");
    const basketCountEl = document.querySelector(".basket_count") ;
    basketCountEl.innerHTML = basketList.length > 0 ? basketList.length:null ;
    const totalPriceEl = document.querySelector(".btn_total") ;

    let basketListHtml = "" ;
    let totalPrice = 0;
    basketList.forEach((item) => {
        totalPrice += item.product.price * item.quantity ;
        basketListHtml += `<li>
        <img src="${item.product.imgSource}" width="120" height="180">
        <div class="basket_item-info">
            <h3 class="basket_name">${item.product.name}</h3>
            <span class="basket_price">${item.product.price} TL</span><br>
            <span class="basket_remove" onclick="removeItemToBasket(${item.product.id})">Temizle</span>
        </div>
        <div  class="glasses_count">
            <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})">-</span>
            <span>${item.quantity}</span>
            <span class="increase" onclick="increaseItemToBasket(${item.product.id})">+</span>
        </div>
        </li>`;
    });
    basketListEl.innerHTML = basketListHtml ? basketListHtml : `<li class="empty_heart">Sepetiniz Boş Lütfen Ürün Ekleyiniz</li>`;
    totalPriceEl.innerHTML = totalPrice > 0 ? "TOPLAM :" + totalPrice + "TL" : null ;
};

//Beğenilenler kısmındaki gözlüklerin dinamik hale getirilme ve listelenme kodları

const listHeartItems = () => {
    const heartListEl = document.querySelector(".heart_list");
    const heartCountEl = document.querySelector(".heart_counts");
    heartCountEl.innerHTML = heartList.length > 0 ? heartList.length:null;

    let heartListHtml = "" ;
    heartList.forEach((item) => {
        heartListHtml += `<li>
        <img src="${item.product.imgSource}" width="120" height="180">
        <div class="heart_item_info">
            <h3 class="heart_name">${item.product.name}</h3>
            <span class="heart_price">${item.product.price} TL</span>
            <span class="heart_old_price">${item.product.oldPrice} TL</span>
            <span class="heart_remove" onclick="removeItemToHeart(${item.product.id})">Temizle</span>
            
        </div>
        <div class="heart_count">
            <span class="heart_icon_modal"><i class="bi bi-bag-check-fill" onclick="addToHeartToBasket(${item.product.id})"></i></span>
        </div>
        <div class="heart_btn">
            <button class="btn_heart_btn" onclick="removeItemToHeartAll(${item.product.id})">TÜMÜNÜ TEMİZLE</button>
        </div>
        </li>`;
    });
    heartListEl.innerHTML = heartListHtml ? heartListHtml : `<li class="empty_heart">Beğenilen Ürün Bulunamadı Lütfen Ürün Beğeniniz</li>`;
}; 

//Ürünlerin sepete eklenme olayını dinamik hale getiren kod

const addGlassToBasket = (glassId) => {
    let findedGlass = glassesList.find(glass => glass.id == glassId);
    if(findedGlass) {
        const basketAlreadyIndex = basketList.findIndex(basket => basket.product.id == glassId);
        if (basketAlreadyIndex == -1) {
            let addedItem = {quantity : 1 , product : findedGlass };
            basketList.push(addedItem);
        }else {
            if (
                basketList[basketAlreadyIndex].quantity <
                basketList[basketAlreadyIndex].product.stock
                )
            basketList[basketAlreadyIndex].quantity += 1;
            else {
                toastr.error("Stok miktarını geçtiniz");
            return;
            }
        }
        listBasketItems();
        toastr.success("Ürün sepetinize eklendi");
    }
};

//Ürünlerin beğenilenler kısmına eklenme olatını dinamik hale getiren kod 

const addGlassToHeart = (glassId) => {
    let findedGlass = glassesList.find(glass => glass.id == glassId);

    if (findedGlass) {
        const heartAlreadyIndex = heartList.findIndex(heart => heart.product.id == glassId);
        if (heartAlreadyIndex == -1) {
            let addedItemH = {quantity : 1 , product : findedGlass };
            heartList.push(addedItemH);
            toastr.success("Ürün Beğenildi");
        }else {
            let addedItemH = {quantity : 1 , product : findedGlass };
            heartList.splice(addedItemH , 1);
            toastr.error("Ürün Kladırıldı");
        }
        listHeartItems();
    };
};


//Beğenilenler kısmındaki gözlüklerin tek tek sepete aktarılması olayını dinamik hale getiren kod 

const addToHeartToBasket = (glassId) => {

    let findedGlass = glassesList.find(glass => glass.id == glassId);
    if (findedGlass) {
        const heartToBaketAlreadyIndex = basketList.findIndex(ToBasket => ToBasket.product.id == glassId);
        if (heartToBaketAlreadyIndex == -1) {
            let addedItemHB = {quantity : 1 , product: findedGlass };
            basketList.push(addedItemHB);
            toastr.success("Ürün Sepete Eklendi");

            let addedItemH = {quantity : 1 , product : findedGlass };
            heartList.splice(addedItemH , 1);
            listHeartItems();
        }
        listBasketItems();
    }
};

//Sepetteki gözlüklerin tek tek kaldırılmasını dinamik hale getiren kod 

const removeItemToBasket = (glassId) => {
    const findedIndex = basketList.findIndex
    ((basket) => basket.product.id == glassId);
    if(findedIndex != -1) {
        basketList.splice(findedIndex, 1);
        toastr.error("Ürün Kladırıldı");
    }
    listBasketItems();
};

//Beğenilenler kısmındaki gözlüklerin tek tek kaldırılmasını dinamik hale getiren kod 

const removeItemToHeart = (glassId) => {
    const findedIndex = heartList.findIndex
    ((heart) => heart.product.id == glassId);
    if (findedIndex != -1) {
        heartList.splice(findedIndex , 1);
        toastr.error("Ürün Kladırıldı");
    }
    listHeartItems();
};

//Beğenilenler kısmındaki ürünlerin tamamını tek tuşla silme olayını dinamik hale getiren kod 

const removeItemToHeartAll = (glassId) => {
    let findedGlass = glassesList.find(glass => glass.id == glassId);
    if (findedGlass) {

        let addedItemH = {quantity : 1 , product : findedGlass };
        heartList.splice(addedItemH );
        toastr.error("Ürünlerin Tamamı Temizlendi");
        listHeartItems();
    };
};

//Sepet kısmındaki ürünlerin tamamını tek tuşla silme olayını dinamik hale getiren kod 

const removeItemToBasketAll = () => {
    if (basketList != -1) {

        let addedItem = {quantity : 1};
        basketList.splice(addedItem );
        toastr.error("Ürünlerin Tamamı Temizlendi");
        listBasketItems();
    };
};

//Sepetteki ürünlerin sayısını birer birer stok durumuna göre arttırma olayını dinamik hale getiren kod 

const decreaseItemToBasket = (glassId) => {
    const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == glassId
    );
    if (findedIndex != -1) {
        if (basketList[findedIndex].quantity != 1)
        basketList[findedIndex].quantity -= 1 ;
    else removeItemToBasket(glassId);
    toastr.error("Ürün Kaldırıldı");
    listBasketItems();
    }
};

//Sepetteki ürünlerin sayısını azaltma olayını dinamik hale getiren kod 

const increaseItemToBasket = (glassId) => {
    const findedIndex = basketList.findIndex
    ((basket) => basket.product.id == glassId
    );
    if (findedIndex != -1) {
        if (
        basketList[findedIndex].quantity < basketList[findedIndex].product.stock
        )
        basketList[findedIndex].quantity += 1 ; 
    else toastr.error("Stok miktarını geçtiniz");
    listBasketItems();
    }
};

setTimeout (() => {
createPopularGlassesItemHtml();
}, 100);