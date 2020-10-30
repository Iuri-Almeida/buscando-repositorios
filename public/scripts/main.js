function createElements (infos) {
    const divContainer = document.getElementById('container');

    // criando div#repository
    const divRepository = document.createElement('div');
    divRepository.setAttribute('id', 'repository');    
    divRepository.setAttribute('class', 'animate-up');
    divContainer.appendChild(divRepository);

    // criando main
    const main = document.createElement('main');
    divRepository.appendChild(main);

    // criando img#cancel-img
    const cancelImg = document.createElement('img');
    cancelImg.setAttribute('id', 'cancel-img');
    cancelImg.setAttribute('src', './public/images/cancel.svg');
    cancelImg.setAttribute('alt', 'Voltar');
    cancelImg.setAttribute('title', 'Voltar');
    cancelImg.setAttribute('onclick', 'removeRepository()');
    main.appendChild(cancelImg);

    // criando div#repo-header
    const divRepoHeader = document.createElement('div');
    divRepoHeader.setAttribute('id', 'repo-header');
    main.appendChild(divRepoHeader);

    // criando a (link do repositório)
    const repoLink = document.createElement('a');
    repoLink.setAttribute('href', infos.repoURL);
    repoLink.setAttribute('target', '_blank');
    divRepoHeader.appendChild(repoLink);

    // criando h1 (nome do repositório)
    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(infos.repoName));
    repoLink.appendChild(h1);

    // criando div#repo-description
    const divRepoDescription = document.createElement('div');
    divRepoDescription.setAttribute('id', 'repo-description');
    main.appendChild(divRepoDescription);

    // criando p (descrição)
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(infos.repoDes));
    divRepoDescription.appendChild(p);

    // criando div#repo-owner
    const divRepoOwner = document.createElement('div');
    divRepoOwner.setAttribute('id', 'repo-owner');
    main.appendChild(divRepoOwner);

    // criando img (proprietário)
    const userImg = document.createElement('img');
    userImg.setAttribute('src', infos.userAvatar);
    userImg.setAttribute('alt', 'Foto do propietário');
    divRepoOwner.appendChild(userImg);

    // criando a (link do perfil do propietário)
    const userLink = document.createElement('a');
    userLink.setAttribute('href', infos.userPage);
    userLink.setAttribute('target', '_blank');
    divRepoOwner.appendChild(userLink);

    // criando span (nome do propietário)
    const userSpan = document.createElement('span');
    userSpan.appendChild(document.createTextNode(infos.userName));
    userLink.appendChild(userSpan);
}

function removeRepository () {
    const repository = document.getElementById('repository');
    let inputElement = document.querySelector('div#page-landing input');

    repository.remove();
    inputElement.value = '';
}

function getRepositoryInfo (URL, repository) {
    return fetch(URL + repository);
}

function getResponse (response) {
    return response.json();
}

async function getData (input, infos) {
    try {
        // get repository info
        const responseRepo = await getRepositoryInfo(repositoryURL, input.value);
        const dataRepo = await getResponse(responseRepo);

        const repoDes = dataRepo.description;
        const repoURL = dataRepo.html_url;
        const repoName = dataRepo.name;

        infos.repoDes = repoDes;
        infos.repoURL = repoURL;
        infos.repoName = repoName;

        // get user info
        const inputInfo = input.value.split('/');

        const responseUser = await getRepositoryInfo(userURL, inputInfo[0]);
        const dataUser = await getResponse(responseUser);

        const userAvatar = dataUser.avatar_url;
        const userPage = dataUser.html_url;
        const userName = dataUser.name;

        infos.userAvatar = userAvatar;
        infos.userPage = userPage;
        infos.userName = userName;

        if (infos.repoURL === undefined || infos.repoName === undefined || infos.userPage === undefined || infos.userName === undefined) {
            alert("Repositório indicado não foi encontrado.");
            return
        } else {
            createElements(infos);
        }
    } catch (error) {
        alert("Erro na busca do repositório!");
        console.error(error)
    }
}

const buttonElement = document.querySelector('div#button button');
const repositoryURL = "https://api.github.com/repos/";
const userURL = "https://api.github.com/users/";

buttonElement.onclick = event => {
    let inputElement = document.querySelector('div#page-landing input');
    const infos = {};

    if (inputElement.value === '') {
        inputElement.style.border = "2px solid red";
        event.preventDefault();
    } else if (document.getElementById('repository') != null) {
        document.getElementById('repository').remove();
        getData(inputElement, infos);
    } else {
        inputElement.style.border = "2px solid #DBDBDB";
        getData(inputElement, infos);
    }
}