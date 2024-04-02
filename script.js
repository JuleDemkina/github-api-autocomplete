const input = document.querySelector(".input-field"); 
const autocomplete = document.querySelector(".autocomplete"); 
const repositorys = document.querySelector('.repositorys')

const debounce = (fn, debounceTime) => {
  let timer;

  return function() {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, debounceTime);

  }
};

async function searchRepo(name) {
  const reposJSON = await fetch(`https://api.github.com/search/repositories?q=${name}&per_page=5`);
  const repos = await reposJSON.json()
  return repos.items
}

function saveRepo(item) {
  return () => {
    const repoLi = document.createElement('li')

    let itemName = document.createElement('div')
    itemName.textContent =  `Name:  ${item.name }`
    repoLi.append(itemName);

    let itemOwner =  document.createElement('div')
    itemOwner.textContent  = `Owner: ${item.owner.login} `
    repoLi.append(itemOwner);

    let itemStar = document.createElement('div')
    itemStar.textContent  = `Stars:  ${item.stargazers_count}`
    repoLi.append(itemStar);

    const closeBtn = document.createElement('div');
      closeBtn.classList.add('close')

      closeBtn.addEventListener("click", function(li) {
        this.parentElement.remove()
      } )

      repoLi.append(closeBtn)
    repositorys.append(repoLi)
    
    autocomplete.innerHTML = '';
    input.value = ''
  }
}

async function createAutocompleteList() {
  autocomplete.innerHTML = '';

  const value = input.value

  if (value.replaceAll(' ', '') !== "") {
    const arrRepo = await searchRepo(value)
    arrRepo.forEach(repo => {
    const li = document.createElement('li')
    li.textContent = repo.name;
    autocomplete.append(li)

    li.addEventListener('click', saveRepo(repo))

   
  })
  }

  
}

input.addEventListener('input', debounce(createAutocompleteList, 500))


