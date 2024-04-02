
const searchButton = document.getElementById('search');
const usernameInput = document.getElementById('username');
const profile = document.getElementById('profile');
const profileName = document.getElementById('profile-name');
const profileImage = document.getElementById('profile-image');
const profileBio = document.getElementById('profile-bio');
const profileFollowers = document.getElementById('profile-followers');
const profileFollowing = document.getElementById('profile-following');
const reposTitle = document.getElementById('repos-title');
const reposList = document.getElementById('repos-list');

searchButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        const cachedUserData = localStorage.getItem(`${username}-data`);
        const cachedRepos = localStorage.getItem(`${username}-repos`);
        if (cachedUserData && cachedRepos) {
            displayUserData(JSON.parse(cachedUserData), JSON.parse(cachedRepos));
        } else {
            fetch(`https://api.github.com/users/${username}`)
                .then(response => response.json())
                .then(userData => {
                    if (userData.login) {
                        fetch(`https://api.github.com/users/${username}/repos`)
                            .then(response => response.json())
                            .then(reposData => {
                                displayUserData(userData, reposData);
                                localStorage.setItem(`${username}-data`, JSON.stringify(userData));
                                localStorage.setItem(`${username}-repos`, JSON.stringify(reposData));
                            })
                            .catch(error => {
                                alert('Failed to fetch repositories data');
                            });
                    } else {
                        throw new Error('User not found');
                    }
                })
                .catch(error => {
                    alert('User not found. Please try again.');
                });
        }
    } else {
        alert('Please enter a GitHub username.');
    }
});

function displayUserData(userData, reposData) {
    profile.style.display = 'block';
    profileName.textContent = userData.name || userData.login;
    profileImage.src = userData.avatar_url;
    profileBio.textContent = userData.bio || '';
    profileFollowers.textContent = `Followers: ${userData.followers}`;
    profileFollowing.textContent = `Following: ${userData.following}`;
    displayRepos(reposData);
}

function displayRepos(reposData) {
    reposList.innerHTML = '';
    reposData.forEach(repo => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        const repoDetails = document.createElement('div');
        const forks = document.createElement('span');
        const stars = document.createElement('span');
        const issues = document.createElement('span');
        const language = document.createElement('span');

        link.textContent = repo.name;
        link.href = repo.html_url;

        forks.textContent = `Forks: ${repo.forks}`;
        stars.textContent = `Stars: ${repo.stargazers_count}`;
        issues.textContent = `Issues: ${repo.open_issues_count}`;
        language.textContent = `Language: ${repo.language}`;

        listItem.appendChild(link);
        listItem.appendChild(repoDetails);
        repoDetails.appendChild(forks);
        repoDetails.appendChild(stars);
        repoDetails.appendChild(issues);
        repoDetails.appendChild(language);

        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        repoDetails.classList.add('repo-details');

        reposList.appendChild(listItem);
    });
}