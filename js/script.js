// Cibler la class .meteo
let meteoApp = document.querySelector('.meteo');
// Cibler le botton Rechercher
let btnSubmit = document.querySelector('input[type=submit]');


// La requette avec options → Ville
let getUrl = (ville) => {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=84acba7d48b3a8080b4011ad177b8a26&units=metric&lang=fr`;
    return url;
}

// Créer la function getData async
let getData = async (url) => {
    let response = await fetch(url);
    let json = await response.json();
    return json;
}

// Création generateDom pour affiche le resultat dans le dom
let generateDom = async (url) => {

    // Afficher le Loadding en attendant la reponse de await
    meteoApp.innerHTML = `<div class="loader">Chargement...</div>`;
    let data = await getData(url);

    try {
        // Options de date aujourd'hui
        let options = {
            weekly: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        // Déclarer une date Aujourd'hui recuperé dans la data, avec les options
        let today = new Date(data.dt * 1000).toLocaleDateString("fr-FR", options);

        // Heure de lever du soliel
        let dateSoleil = new Date(data.sys.sunrise * 1000);
        let hour = dateSoleil.getHours();
        let minute = dateSoleil.getMinutes();

        // Afficher les données dans le dom
        meteoApp.innerHTML = `
        <p class="ville">${data.name}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="meteo d'aujourd'hui dans ${data.name}"/>
        <p class="temp">${data.weather[0].description}</p>
        <h2 class="temperature">${Math.floor(data.main.temp)}°</h2>
        <p class="date">${today}</p>
        <div class="prevision">
                    <div class="soliel">
                        <span>lever du soliel</span>
                        <p>${hour}:${minute}</p>
                    </div>
                    <div class="vent">
                        <span>vitesse du vent</span>
                        <p>${data.wind.speed} km/h</p>
                    </div>
                    <div class="tmin-tmax">
                        <span>temperature min/max</span>
                        <p>${Math.floor(data.main.temp_min)}°/${Math.ceil(data.main.temp_max)}°</p>
                    </div>
                </div>
        `;
        document.querySelector('input[type=search]').value = "";
        document.querySelector('input[type=search]').style.color = "";
        document.querySelector('input[type=search]').style.border = "none";

    } catch (error) {
        let err = '';
        if (data.cod) {
            err = data.cod;
        }
        meteoApp.innerHTML = `<div class="loader">Ville introuvable ! </div><p>Erreur ${data.cod}</p>`;
        document.querySelector('input[type=search]').style.border = "1px solid red";
        document.querySelector('input[type=search]').style.color = "red";
        document.querySelector('input[type=search]').value = "";
    }
}

// recherche une ville
(() => {
    btnSubmit.addEventListener('click', () => {
        let searchInput = document.querySelector('input[type=search]');
        let valeurVille = searchInput.value;
        // appel la fonction generateDom avec argument (getUrl avec argument (ville ))
        generateDom(getUrl(valeurVille));
    });
})();

generateDom(getUrl("paris"));