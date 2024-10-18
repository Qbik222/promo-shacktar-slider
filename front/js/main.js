(function () {
    const PROMO_END_DATE = new Date('2024-10-22T18:30:00.000Z'); //-3 hours
    const apiURL = 'https://fav-prom.com/api_shakhtar_predictor';

    const
        resultsTable = document.querySelector('.table__body-scroll'),
        unauthMsgs = document.querySelectorAll('.unauth-msg'),
        youAreInBtns = document.querySelectorAll('.took-part'),
        predictionBtn = document.querySelector('.predict__btn'),
        yourBetTxt = document.querySelector('.predict__yourBet');

    const ukLeng = document.querySelector('#ukLeng');
    const enLeng = document.querySelector('#enLeng');

    let locale = 'uk';

    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let i18nData = {};
    let userId;
    // userId = 7777777;

    function loadTranslations() {
        return fetch(`${apiURL}/translates/${locale}`).then(res => res.json())
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('shakhtar'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = translateKey(key);
                elem.removeAttribute('data-translate');
            })
        }

        if (locale === 'en') {
            mainPage.classList.add('en');
        }

        refreshLocalizedClass();
    }

    function translateKey(key) {
        if (!key) {
            return;
        }
        return i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
    }

    function refreshLocalizedClass(element, baseCssClass) {
        if (!element) {
            return;
        }
        for (const lang of ['uk', 'en']) {
            element.classList.remove(baseCssClass + lang);
        }
        element.classList.add(baseCssClass + locale);
    }

    const request = function (link, extraOptions) {
        return fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        }).then(res => res.json())
    }

    function getUsers() {
        return request('/users');
    }

    const InitPage = () => {
        getUsers().then(users => {
            renderUsers(users);
            translate();
        })
    }

    function init() {
        initScoreSelector(1);
        initScoreSelector(2);
        initPredictionBtn();

        if (window.store) {
            var state = window.store.getState();
            userId = state.auth.isAuthorized && state.auth.id || '';
            InitPage();
        } else {
            InitPage();
            let c = 0;
            var i = setInterval(function () {
                if (c < 50) {
                    if (!!window.g_user_id) {
                        userId = window.g_user_id;
                        InitPage();
                        checkUserAuth();
                        clearInterval(i);
                    }
                } else {
                    clearInterval(i);
                }
            }, 200);
        }

        checkUserAuth();
    }

    function renderUsers(users) {
        populateUsersTable(users, userId, resultsTable);
    }

    function populateUsersTable(users, currentUserId, table) {
        table.innerHTML = '';
        if (users && users.length) {
            const currentUser = userId && users.find(user => user.userid === currentUserId);
            if (currentUser) {
                displayUser(currentUser, true, table);
            }

            users.forEach((user) => {
                if (user.userid !== currentUserId) {
                    displayUser(user, false, table);
                }
            });
        }
    }

    function displayUser(user, isCurrentUser, table) {
        const additionalUserRow = document.createElement('div');
        additionalUserRow.classList.add('table__row');
        if (isCurrentUser) {
            updateLastPrediction(user);
            additionalUserRow.classList.add('you');
        }

        additionalUserRow.innerHTML = `
                        <div class="table__row-item">${isCurrentUser ? user.userid : maskUserId(user.userid)}</div>
                        <div class="table__row-item">${formatDateString(user.lastForecast)}</div>
                        <div class="table__row-item">${user.team1}:${user.team2}</div>
                        <div class="table__row-item">**************</div>
                    `;
        table.append(additionalUserRow);
    }

    function updateLastPrediction(data) {
        const team1Label = document.querySelector('.scoreTeam1');
        const team2Label = document.querySelector('.scoreTeam2');
        team1Label.innerHTML = data.team1;
        team2Label.innerHTML = data.team2

        // const trueBet = document.querySelector('.predict__bet-true');
        // const falseBet = document.querySelector('.predict__bet-false');
        // if (user.betConfirmed) {
        //     trueBet.classList.remove('hide');
        //     falseBet.classList.add('hide');
        // } else {
        //     trueBet.classList.add('hide');
        //     falseBet.classList.remove('hide');
        // }
    }

    function formatDateString(dateString) {
        const date = new Date(dateString);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} / ${hours}:${minutes}`;
    }

    function maskUserId(userId) {
        return "**" + userId.toString().slice(2);
    }

    let checkUserAuth = () => {
        if (userId) {
            unauthMsgs.forEach(item => item.classList.add('hide'));
            youAreInBtns.forEach(item => item.classList.remove('hide'));
        }
    }

    const scorePrediction = {team1 : 0, team2: 0}

    function initScoreSelector(teamNumber) {
        const minusBtn = document.querySelector(`.team${teamNumber}-minus`);
        const plusBtn = document.querySelector(`.team${teamNumber}-plus`);
        const scorePanel = document.querySelector(`.predictionTeam${teamNumber}`);

        minusBtn.addEventListener('click', () => {
            const fieldTag = `team${teamNumber}`;
            const currentScore = scorePrediction[fieldTag];
            scorePrediction[fieldTag] = Math.max(currentScore - 1, 0);
            scorePanel.innerHTML = scorePrediction[fieldTag];
        });

        plusBtn.addEventListener('click', () => {
            const fieldTag = `team${teamNumber}`;
            const currentScore = scorePrediction[fieldTag];
            scorePrediction[fieldTag] = Math.min(currentScore + 1, 99);
            scorePanel.innerHTML = scorePrediction[fieldTag];
        });
    }

    let isRequestInProgress;
    function initPredictionBtn() {
        document.addEventListener('click', (e) => {
            if (!!e.target.closest('.predict__btn')) {
                if (isRequestInProgress) {
                    return
                }
                yourBetTxt.classList.remove("hide");
                setTimeout(function() {
                    youAreInBtns.forEach(item => item.classList.remove('showBtn'));
                }, 5000);
                youAreInBtns.forEach(item => item.classList.add('showBtn'));
                isRequestInProgress = true;
                predictionBtn.classList.add("pointer-none");
                request('/bet', {
                    method: 'POST',
                    body: JSON.stringify({
                        userid: userId,
                        team1: scorePrediction.team1,
                        team2: scorePrediction.team2
                    })
                }).then(res => {
                    isRequestInProgress = false;
                    predictionBtn.classList.remove("pointer-none");
                    InitPage();
                }).catch(e => {
                    isRequestInProgress = false;
                    predictionBtn.classList.remove("pointer-none");
                });
            }
        });
    }


    loadTranslations()
        .then(init);

    let mainPage = document.querySelector('.fav-page');
    setTimeout(() => mainPage.classList.add('overflow'), 1000);

    const currentDate = new Date();
    if(currentDate >= PROMO_END_DATE) {
        youAreInBtns.forEach(item => item.classList.add('block-btn'));
    }

    // popups
    function setPopups(popups, closeBtns, showBtns){
        popups = document.querySelectorAll(`${popups}`)
        closeBtns = document.querySelectorAll(`${closeBtns}`)
        showBtns = document.querySelectorAll(`${showBtns}`)

        showBtns.forEach((showBtn, showBtnIndex) => {
            showBtn.addEventListener("click", () =>{
                popups.forEach((popup, popupIndex) =>{
                    if(popupIndex === showBtnIndex){
                        popup.classList.toggle("active")
                    }else{
                        popup.classList.remove("active")
                    }
                })
            })
        })
        closeBtns.forEach((showBtn, closeBtnIndex) => {
            showBtn.addEventListener("click", () =>{
                popups.forEach((popup, popupIndex) =>{
                    if(popupIndex === closeBtnIndex){
                        popup.classList.remove("active")
                    }
                })
            })
        })

    }

    setPopups(".guide__list-popup", ".guide__list-popup-close", ".guide__list-btn")

    // scroll add anim

    const tableLightning = document.querySelector('.table');
    const tableCup = document.querySelector('.table__cup');
    const tablePers = document.querySelector('.table__pers');
    const prizeLightning = document.querySelector('.prize');
    const promoTitle = document.querySelector('.promo__title');

    function animateOnScroll(element, animationClass) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                } else {
                    entry.target.classList.remove(animationClass);
                }
            });
        }, options);

        observer.observe(element);
    }
    animateOnScroll(tableLightning, "tableLightning")
    animateOnScroll(tableCup, "fadeInLeft")
    animateOnScroll(tablePers, "fadeInRight")
    animateOnScroll(prizeLightning, "prizeLightning")

    const titles = document.querySelectorAll(".title")

    titles.forEach(title =>{
        animateOnScroll(title, "fadeIn")
    })

})();
