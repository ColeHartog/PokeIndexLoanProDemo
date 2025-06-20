let dexContainer = document.querySelector('#dexContainer')
let mobilePagCountContainer = document.querySelector('#mobilePageCountContainer')

let entryStart = 1
let cardsPerPage = 10

function createDexBox(id){
    let newDiv = document.createElement("div");
    newDiv.id = `dexEntry-${id}`
    newDiv.className = "dexItemContainer";
    newDiv.innerHTML = `
        <img src="/public/images/pokeball.png" alt="pokeball-png">
        <h3>Loading</h3>
        <div class="dexIdBubble">${id.toString()}</div>
    `
    dexContainer.append(newDiv)
}

function updateDexEntry(data){
    let entryDiv = document.querySelector(`#dexEntry-${data.id}`)
    entryDiv.children[1].innerText = data.name
    entryDiv.children[0].src = data.imgSrc
}
    
function fetchPokemonData(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(response => {
        if(!response.ok){
            throw new Error('API Call Error')
        }
        return response.json();
    }).then(data => {
        updateDexEntry({
            id: data.id,
            name: data?.name || 'Missing Name',
            imgSrc: data?.sprites?.front_default || './public/images/pokeball.png'
        })
        
    }).catch(error => {
        console.log(error)
    })
}

function MakeCardsAndGetPokemon(start, total) {
    let max = (total > 1025) ? 1025 : total
    for(var i = start; i <= max; i++){
        createDexBox(i)
        fetchPokemonData(i)
    }
}

function cardPerPageChange(newValue){
    let oldValue = cardsPerPage
    if(newValue > oldValue){
        // Finding the missing end values of the missing entries within the new bounds and creating / calling for their data
        let startValue = entryStart +oldValue
        let endValue = entryStart + Number(newValue) - 1
        cardsPerPage = Number(newValue)
        MakeCardsAndGetPokemon(startValue, endValue)
    }
    else if(newValue < oldValue){
        // Finding the end values of the pokemon that should no longer be showing and removing them from highest to lowest id value
        let startValue = entryStart + oldValue - 1
        let endValue = entryStart + Number(newValue)
        cardsPerPage = Number(newValue)
        for (let i = startValue; i >= endValue; i--) {
            document.querySelector(`#dexEntry-${i}`).remove()
        }
    }
}


function selectUpdate(selectObject) {
    cardPerPageChange(selectObject.value)
}

function clearAllEntries(){
    dexContainer.replaceChildren();
}

function refetchWithBounds(){
    MakeCardsAndGetPokemon(entryStart, entryStart + cardsPerPage - 1)
}

function PageButton(forward){
    if(forward){
        let calcValue = entryStart + cardsPerPage
        entryStart = (calcValue >= 1025) ? 1025 - cardsPerPage : calcValue
    }
    else{
        let calcValue = entryStart - cardsPerPage
        entryStart = (calcValue < 1) ? 1 : calcValue
    }
    clearAllEntries()
    refetchWithBounds()
    if(entryStart == 1){
        document.querySelectorAll('.PrevButton').forEach(Element => {
            Element.setAttribute("disabled", "")
        })
    }
    else{
        document.querySelectorAll('.PrevButton').forEach(Element => {
            Element.removeAttribute("disabled")
        })
    }
    if(entryStart + cardsPerPage >= 1025){
        document.querySelectorAll('.NextButton').forEach(Element => {
            Element.setAttribute("disabled", "")
        })
    }
    else{
        document.querySelectorAll('.NextButton').forEach(Element => {
            Element.removeAttribute("disabled")
        })
    }
    
}

refetchWithBounds()


function showHideMobilePageCount() {
    if (mobilePagCountContainer.style.display == 'none')
        mobilePagCountContainer.style.display = ''
    else
        mobilePagCountContainer.style.display = 'none'
}
