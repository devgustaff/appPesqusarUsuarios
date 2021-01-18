let users = [],
  buttonSearch = null,
  inputSearch = null,
  panelUsers = null,
  panelStatistics = null,
  modalOverlay = null,
  btnCloseModal = null;

const formatter = Intl.NumberFormat("pt-BR");

window.addEventListener("load", () => {
  mapElements();
  doFetchUsers();
  addEvent();
});

function mapElements() {
  buttonSearch = document.querySelector("#buttonSearch");
  inputSearch = document.querySelector("#inputSearch");
  panelUsers = document.querySelector("#panelUsers");
  panelStatistics = document.querySelector("#panelStatistics");
  modalOverlay = document.querySelector(".modal-overlay");
}

function addEvent() {
  inputSearch.addEventListener("keyup", handleKeyUp);
  buttonSearch.addEventListener("click", handleClick);
}

function handleKeyUp(event) {
  if (event.key !== "Enter") return;
  const filterText = event.target.value;

  if (filterText.trim() !== "") filterUser(filterText);
}

function handleClick(event) {
  event.preventDefault();
  const filterText = inputSearch.value;

  if (filterText.trim() !== "") filterUser(filterText);
}

function filterUser(filterText) {
  const filteredUser = users.filter((user) => {
    return user.name.includes(filterText);
  });

  renderUsers(filteredUser);
  renderStatistics(filteredUser);
}

function renderUsers(users) {
  panelUsers.innerHTML = "";
  const h3 = document.createElement("h3");
  const div = document.createElement("div");

  h3.textContent = `${users.length} usuário(s) encontrado(s)
  `;

  users.forEach((user) => {
    const a = document.createElement("a");
    const img = `<img class='avatar' src="${user.picture}" alt="${user.name}" />`;
    const userData = `<span>${user.name}, ${user.age} anos</span>`;

    a.classList.add("flex-row");
    a.classList.add("space-botton");

    a.innerHTML = `${img}${userData}`;

    a.addEventListener("click", () => openModal(user.id));

    div.appendChild(a);
  });
  panelUsers.appendChild(h3);
  panelUsers.appendChild(div);
}

function openModal(id) {
  modalOverlay.classList.add("active");
  
  const user = users.find((user) => user.id === id);
  const modal = renderModal(user);

  modalOverlay.innerHTML = modal;
  btnCloseModal = modalOverlay.querySelector(".close-modal");
  btnCloseModal.addEventListener("click", closeModal);
}

function renderModal(user) {
  return `
    <div class="modal">
      <a class="close-modal">
        close
      </a>  
      <div class="specific-user">
        <div>
          <img src="${user.picture}">
        </div>
        <div class="info-user">
          <div>Nome: ${user.name}</div>
          <div>Sexo: ${user.gender === "male" ? "Masculino" : "Feminino"}</div>
          <div>Idade: ${user.age} anos</div>
          <div>Tel: ${user.phone}</div>
          <div>Endereço: ${user.fullLocation}</div>
          <div>Cidade: ${user.city}</div>
          <div>Estado: ${user.state}</div>
          <div>País: ${user.country}</div>
        </div>
      </div>
    </div>
  `;
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

function renderStatistics(users) {
  const countMale = users.filter((user) => user.gender === "male").length;
  const countFemale = users.filter((user) => user.gender === "female").length;
  const sumAges = users.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);
  const averageAges = sumAges / users.length || 0;

  panelStatistics.innerHTML = `
      <h2>Estatísticas</h2>
      <ul>
        <li>Sexo masculino: <strong>${countMale}</strong> </li>
        <li>Sexo feminino: <strong>${countFemale}</strong></li>
        <li>Soma das idades: <strong>${formatNumber(sumAges)}</strong></li>
        <li>Média das idades: <strong>${formatAverage(
          averageAges
        )}</strong></li>
      </ul>
    `;
}

async function doFetchUsers() {
  const url =
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo";
  const res = await fetch(url);
  const json = await res.json();

  users = json.results
    .map(({ login, name, gender, dob, picture, location, phone }) => {
      const fullName = `${name.first} ${name.last}`;
      const fullLocation = `${location.street.name} ${location.street.number}`;

      return {
        id: login.uuid,
        name: fullName,
        age: dob.age,
        picture: picture.large,
        fullLocation,
        gender,
        city: location.city,
        state: location.state,
        country: location.country,
        phone,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function formatNumber(number) {
  return formatter.format(number);
}

function formatAverage(number) {
  return number.toFixed(2).replace(".", ",");
}
