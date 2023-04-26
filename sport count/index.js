const counterNode = document.querySelector('.js-counter');
const incBtnNode = document.querySelector('.js-inc-btn');
const clearBtnNode = document.querySelector('.js-clean-btn');
let counter = 3;

function render() {
    counterNode.innerText = counter; 
};
function increment() {
    counter += 1;
};
function clear() {
    counter = 0;
};
incBtnNode.addEventListener('click',() =>{
    counter += 1;
    render() 

});

clearBtnNode.addEventListener('click',() =>{
    counter = 0;
    render()

});

console.log(counter);