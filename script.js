const container = document.getElementById("carros");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

document.getElementById("btnBuscar").addEventListener("click", buscarCarros);

async function buscarCarros() {
  const busca = document.getElementById("search").value.toLowerCase();

  const resposta = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas");
  const dados = await resposta.json();

  container.innerHTML = "";

  const filtrados = dados.filter(carro =>
    carro.nome.toLowerCase().includes(busca)
  );

  filtrados.slice(0, 12).forEach(carro => {
    const isFav = favoritos.some(f => f.codigo === carro.codigo);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="img-box">
        <img src="https://source.unsplash.com/featured/?car,${carro.nome}" alt="${carro.nome}">
        <div class="fav ${isFav ? 'active' : ''}" onclick='toggleFavorito(${JSON.stringify(carro)})'>
          ❤️
        </div>
      </div>

      <div class="card-content">
        <h2>${carro.nome}</h2>
        <p>ID: ${carro.codigo}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/* favoritos */
function toggleFavorito(carro) {
  const index = favoritos.findIndex(f => f.codigo === carro.codigo);

  if (index > -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(carro);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  buscarCarros();
}

/* localização */
function usarLocalizacao() {
  navigator.geolocation.getCurrentPosition(pos => {
    alert(`📍 Lat: ${pos.coords.latitude}
Lng: ${pos.coords.longitude}`);
  });
}

/* PWA */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* carregar inicial */
buscarCarros();