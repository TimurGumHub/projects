const appNode = document.querySelector('.my_js');

const book = {
    game: 'Hogwarts',
    year: '2022',
    image: 'https://cdn1.epicgames.com/offer/e97659b501af4e3981d5430dad170911/EGS_HogwartsLegacy_AvalancheSoftware_S1_2560x1440-2baf3188eb3c1aa248bcc1af6a927b7e',

}

function render() {
    const html = `
        <div>
            <h1>${book.game}</h1>
            <p>${book.year}</p>
            <img
                src='${book.image}'
                alt='${book.game},${book.year}'
        </div>
    `;
    appNode.innerHTML = html;
}
render();
console.log(book.game);