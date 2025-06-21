export default function FetchPokemonData(id, callback) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(response => {
        if(!response.ok){
            throw new Error('API Call Error')
        }
        return response.json();
    }).then(data => {
        callback({
            id: data.id,
            name: data?.name || 'Missing Name',
            imgSrc: data?.sprites?.front_default || './public/images/pokeball.png'
        }) // Passing in the new values for the entry if they exist on the data object and if not passing in some placeholders
    }).catch(error => {
        callback({
            id: id,
            name: 'Missing Entry',
            imgSrc: './public/images/questionmark.png'
        }) // On error or no response from the API updating entry data to show it's missing
    })
}