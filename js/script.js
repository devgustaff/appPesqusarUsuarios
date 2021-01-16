let users = [],
  buttonSearch = null,
  inputSearch = null,
  panelUsers = null,
  panelStatistics = null;

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
}

function addEvent() {
  inputSearch.addEventListener("keyup", handleKeyUp);
  buttonSearch.addEventListener("click", handleClick);
}

function handleKeyUp(event) {
  event.preventDefault();
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
  const ul = document.createElement("ul");

  h3.textContent = `${users.length} usuário(s) encontrado(s)
  `;

  users.forEach((user) => {
    const li = document.createElement("li");
    const img = `<img class='avatar' src="${user.picture}" alt="${user.name}" />`;
    const userData = `<span>${user.name}, ${user.age} anos</span>`;

    li.classList.add("flex-row");
    li.classList.add("space-botton");
    li.innerHTML = `${img}${userData}`;

    ul.appendChild(li);
  });
  panelUsers.appendChild(h3);
  panelUsers.appendChild(ul);
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
    .map(({ login, name, gender, dob, picture }) => {
      const fullName = `${name.first} ${name.last}`;

      return {
        id: login.uuid,
        name: fullName,
        age: dob.age,
        picture: picture.large,
        gender,
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
