'use strict'

const main__items = document.querySelector(".main__items");
const positions = document.querySelector(".positions");
const add__champions = document.querySelector(".add__champions");
const main = document.querySelector(".main");
const add = document.querySelector(".add");
const aft__price = document.querySelector(".aft__price");
const af__total = document.querySelector(".af__total");
const LC_CHAMP = 'champion';
let numSum = 0;
let todos =[];

const load = function loadItems(){
    return fetch('item.json')
    .then(response =>{
        return response.json();
    })
    .then(json =>{
        return json.champions
    });
}

function saveLocal(todos){
    localStorage.setItem(LC_CHAMP, JSON.stringify(todos));
}

function displayChamps(champs){
    main__items.innerHTML = champs.map(champ =>{
        return `
        <div class="main__item" data-key="${champ.key}">
            <div class="mi__title">${champ.name}</div>
            <img src="${champ.imgPath}" class="mi__img">
            <div class="mi__footer">
                <div class="mif__price">$${champ.price}</div>
                <button class="mif__btn">ADD TO CART</button>
            </div>
        </div>
        `;
    }).join("");
}

function positionType(e, champs){
    const target = e.target;
    const targetType = target.dataset.type;
    if(targetType !== 'all' && targetType){
        const filterChamp = champs.filter(champ =>{
            return champ.position === targetType;
        });
        displayChamps(filterChamp);
    }else if(targetType === 'all'){
        displayChamps(champs);
    }
}

function subPrice(champ){
    const sub = champ.map(item => {
        return item.price;
    }).join("");
    let floatPrice = parseFloat(sub);
    floatPrice *= champ[0].count;
    numSum -= floatPrice;
    aft__price.innerHTML = '$'+numSum.toFixed(2);
}

function removeHandle(e, champs){
    const target = e.target;
    if(target.className === 'act__delete'){
        const t_parent = target.parentNode;
        const t_p_parent = t_parent.parentNode;
        const key = t_p_parent.dataset.key;
        if(key){
            t_p_parent.remove();
            const fillterArray = champs.filter(champ => {
                return champ.key === key;
            });
            subPrice(fillterArray);
        }    
    }
}

function quantityPlus(champ){
    console.log(champ);
    const key = champ[0].key;
    const act__count = document.querySelector(`.act__count[data-count="${key}"]`);
    const count = ++champ[0].count;
    act__count.innerText = count;
}

function addChampsDisplay(champ){
    
    if(champ[0].bool === true){
        // console.log(champ[0].bool);
        add.innerHTML += champ.map(item =>{
            return  `
            <div class="add__champions" data-key="${item.key}">
            <div class="ac__one">
                <img src="${item.imgPath}"  class="aco__img">
                <div class="aco__text">${item.name}</div>
            </div>
            <div class="ac__two__text">$${item.price}</div>
            <div class="ac__three">
                <div class="act__count" data-count="${item.key}">1</div>
                <button class="act__delete">REMOVE</button>
            </div>
            </div>
            `;
        });
        champ[0].bool = false;
    }else
        quantityPlus(champ);

    const strPrice = champ.map(item =>{
        return item.price;
    }).join('');
    const numPrice = parseFloat(strPrice);
    numSum += numPrice;
    aft__price.innerHTML ='$' + numSum.toFixed(2); 
}

function addChamps(e,champs){
    const target = e.target;
    const t_parent = target.parentNode;
    const t_p_parent = t_parent.parentNode;
    const key = t_p_parent.dataset.key;
    if(target.className === 'mif__btn'){
        const filterArray = champs.filter(champ =>{
            return champ.key === key;
        });
        addChampsDisplay(filterArray);
        
    }
}



load().then(champions =>{
    // loadedLocalItems();
    displayChamps(champions);
    main.addEventListener('click', event =>{
        addChamps(event, champions);
    });
    positions.addEventListener('click', event =>{
        positionType(event, champions);
    });
    add.addEventListener('click', event =>{
        removeHandle(event, champions);
    });
})