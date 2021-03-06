// Handlers {
  function handleRepoClick (e) {
    e.preventDefault()
    const baseUrl = window.location.origin
    const repoName = e.target.getAttribute('data-full_name')

    const repoURL = e.target.getAttribute('data-url')

    loadRepoView(repoURL)
    // loadRepoView(`${baseUrl}/${repoName}`)
    window.location.href = baseUrl + '#' + repoName
  }
// Handlers END }

// Views {
  function loadHomeView (e) {
    e.preventDefault()
    console.log("loadHomeView")
    const baseUrl = window.location.origin
    window.location = baseUrl
  }

  function loadRepoView (repoURL) {

    fetch(`${repoURL}/stats/commit_activity`)
    // fetch(window.location.origin + '/src/js/mock-repo-activity.json')
      .then(res => {
        return res.json()
      })
      .then(activities => {
        if (!activities.length) {
          loadRepoView(repoURL)
          return
        }

        const actDiv = document.getElementById('stage')
        const acts = ['<div id="repo-activity" class="column"><div class="repo-activity-wrapper">']

        activities.forEach(act => {
          acts.push('<ul>')
          act.days.forEach(day => {
            let className = 'grey-zero'

            if (day > 0) {
              className = 'green'
            }

            acts.push(`<li class="${className}"></li>`)
          })
          acts.push('</ul>')
        });
        acts.push('</div></div>')

        actDiv.innerHTML = acts.join('')
      })
  }
// Views END }


// Everything begins here
window.onload = () => {
  const username = "Cu7ious"
  // const actualUrl = '//porpoise.holberton.us'

  // To grab user & repos
  // fetch(url + '/repo', {method: 'POST'})
      // .then(res => {
      //   return res.json()
      // })
      // .then(data => {
      //   const { user, repos } = data
      //   console.log(data)
      // })

  // To log out
  // fetch(url + '/logout', {method: 'POST'})

  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      return res.json()
    })
    .then(user => {
      console.log('user:', user)
      const {
        avatar_url,
        login,
        name,
      } = user

      let {
        bio,
        company,
        location,
        blog,
      } = user

      bio = bio ? `<p>${bio}</p>` : null
      company = company ? `<li>${company}</li>` : null
      location = location ? `<li>${location}</li>` : null
      blog = blog ? `<li>${blog}</li>` : null

      const userDiv = document.getElementById('user')
      userDiv.innerHTML = `
        <figure>
            <img id="avatar_url" src="${avatar_url}" alt="${login}">
        </figure>
        <h3>${name}</h3>
        <h4>${login}</h4>
        ${bio}
        <div class="user-extras">
            <ul>
              ${company}
              ${location}
              ${blog}
            </ul>
        </div>
      `

      fetch(user.repos_url)
        .then(res => {
          return res.json()
        })
        .then(repos => {
          console.log('repos:', repos)
          const reposDiv = document.getElementById('repos')

          if (repos.length > 0) {

            repos.forEach((repo, idx) => {

              if (idx === 0) {
                fetch(`${repo.url}/stats/commit_activity`)
                .then(res => {
                    return res.json()
                  })
                  .then(activities => {
                    console.log(activities)
                  })
              }

              const { html_url, url } = repo

              let {
                full_name,
                private,
                fork,
                forks,
                forks_count,
                pushed_at,
                updated_at
              } = repo

              full_name = full_name.split(username + '/')[1]

              reposDiv.innerHTML = reposDiv.innerHTML + `
                <article>
                  <h5>
                    <a
                      data-full_name="${full_name}"
                      data-url="${url}"
                      href="#"
                      onClick="handleRepoClick(event)"
                    >
                      ${full_name}
                    </a>
                  </h5>
                  <div class="tags">
                      <p>     private: ${private}</p>
                      <p>     fork: ${fork}</p>
                      <p>     forks: ${forks}</p>
                      <p>     forks count: ${forks_count}</p>
                  </div>
                  <div class="time">
                      <p>     pushed at: ${pushed_at}</p>
                      <p>     updated at: ${updated_at}</p>
                  </div>
                </article>
              `
            })
          } else {
            reposDiv.innerHTML = `<h4>No repos, nothing to show<h4>`
          }
        })
    })
}
