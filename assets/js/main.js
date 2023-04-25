const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('modal')
const body = document.querySelector('body')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="showDetails(${pokemon.number})">
            <div class="details">
                <span class="number">${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <ul class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ul>
            </div>

            <div class="img">
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function showDetails(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`

    modal.classList.remove('hide')
    overlay.classList.remove('hide')
    body.classList.add('overflow-hidden')

    pokeApi.getAllPokemonDetails(url)
        .then((pokemon) => modalBody.innerHTML +=
            `
            <li class="modal-pokemon">
                <div class="${pokemon.types[0].type.name}">
                    <img src="${pokemon.sprites.other.dream_world.front_default}" class="${pokemon.types[0].type.name}" alt="${pokemon.name}">
                </div>
                <div class="modal-heading ${pokemon.types[0].type.name}">
                    <span class="number">${pokemon.id}</span>
                    <span class="name">${pokemon.name}</span>
                </div>
                <div class="modal-body">
                    <div class="size">
                            <p>Height: <span>${pokemon.height}</span></p>
                            <p>Weight: <span>${pokemon.weight}</span></p>
                    </div>
                    <p class="detail">Types:</p>
                    <div class="types">
                            ${pokemon.types.map(item => `<span class="${item.type.name}">${item.type.name}</span>`).join('')}</span>
                    </div>
                    <p class="detail">Abilities:</p>
                    <div class="abilities">
                            ${pokemon.abilities.map(item => `<div>${item.ability.name}</div>`).join('')}
                    </div>
                </div>
            </li>
            `)
}


function closeModal() {
    modal.classList.add('hide')
    overlay.classList.add('hide')
    body.classList.remove('overflow-hidden')
    modalBody.innerHTML = ''
}