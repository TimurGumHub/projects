const todosNode = document.querySelector('.js-todos');
const inputNode = document.querySelector('.js-input');
const buttonNode = document.querySelector('.js-btn');




let todos = [];

function addTodo(text) {
    const todo = {
        text,
        done: false,
        id: `${Math.random()}`
    };

    todos.push(todo);
}

function delTodo(id) {
    todos.forEach(todo => {
        if (todo.id === id) {
            todo.done = true;
        }
        
    });
    
}

function render() {
    console.log(todos);
    let html = '';
    todos.forEach(todo => {
        if (todo.done) {
            return;
        };

        html += `
            <div>
                ${todo.text}
                <button data-id='${todo.id}'>Сделано</button>
            </div>
        `;
    });
    todosNode.innerHTML = html;
}

buttonNode.addEventListener('click', () =>{
    const text = inputNode.value;

    addTodo(text);

    render();
});

todosNode.addEventListener('click', (event) =>{
    if (event.target.tagName !== 'BUTTON') {
        return;
        
    }
    const id = event.target.dataset.id;
    delTodo(id);
})

render();