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
    // userId = 100300268

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

    const scorePrediction = [
        {team1 : 0, team2: 0},
        {team1 : 0, team2: 0},
        {team1 : 0, team2: 0},
        {team1 : 0, team2: 0},
        {team1 : 0, team2: 0},
    ]

    function setScore(teamNumber){
        const scorePanels = document.querySelectorAll(`.predictionTeam${teamNumber}`);

        const fieldTag = `team${teamNumber}`;

        scorePanels.forEach((panel, i) =>{
            panel.innerHTML = scorePrediction[i][fieldTag];
        })
    }

    function initScoreSelector(teamNumber) {
        const minusBtns = document.querySelectorAll(`.team${teamNumber}-minus`);
        const plusBtns = document.querySelectorAll(`.team${teamNumber}-plus`);
        const scorePanels = document.querySelectorAll(`.predictionTeam${teamNumber}`);

        const fieldTag = `team${teamNumber}`;

        scorePanels.forEach((panel, i) =>{
            panel.innerHTML = scorePrediction[i][fieldTag];
        })


        minusBtns.forEach((btn, i) => {
            btn.addEventListener('click', () => {

                const currentScore = scorePrediction[i][fieldTag];
                console.log(scorePrediction)
                scorePrediction[i][fieldTag] = Math.max(currentScore - 1, 0);
                scorePanels.forEach(panel =>{
                    panel.innerHTML = scorePrediction[i][fieldTag];
                })

            });
        })


        plusBtns.forEach((btn, i) =>{
            btn.addEventListener('click', () => {
                // const fieldTag = `team${teamNumber}`;
                const currentScore = scorePrediction[i][fieldTag];
                scorePrediction[i][fieldTag] = Math.min(currentScore + 1, 99);
                scorePanels.forEach(panel =>{
                    panel.innerHTML = scorePrediction[i][fieldTag];
                })
            });
        })

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



    /// гліч слайдер
    function createSlider(slides, leftBtn, rightBtn, slidesIcons, current, path, img, week, coverflow, coverflowOffWidth, subtitles, copySlides){
        let coverflowToggler = true
        if(window.innerWidth < coverflowOffWidth){
            coverflowToggler = false
        }
        function coverFlowClasses(right, left, slides) {
            slides.forEach((slide, i) => {
                if (coverflowToggler) {
                    if (current === i) {
                        let prevIndex = (i - 1 + slides.length) % slides.length;
                        slides[prevIndex].classList.add(right);
                        let nextIndex = (i + 1) % slides.length;
                        slides[nextIndex].classList.add(left);
                    }
                }
            });
        }

        slides = document.querySelectorAll(slides);
        subtitles = document.querySelectorAll(subtitles);
        leftBtn = document.querySelector(leftBtn);
        rightBtn = document.querySelector(rightBtn);
        slidesIcons = document.querySelectorAll(slidesIcons);
        let glitchLayers = [];
        slides.forEach(slide => {
            glitchLayers = [...glitchLayers, ...slide.querySelectorAll(".glitch__layer")];
        });
        if(slides[current])slides[current].classList.add("_active");
        if(coverflow){
            coverFlowClasses("right-cover", "left-cover", slides)
        }

        // function subtitlesInit(subtitles, slides){
        //     // console.log(slides)
        //     slides.forEach((slide, slideIndex) =>{
        //         if(slide.classList.contains("_active")){
        //             subtitles.forEach((subtitle, subtitleIndex) =>{
        //                 subtitle.classList.remove("_active")
        //                 if(slideIndex === subtitleIndex){
        //                     subtitle.classList.add("_active")
        //                 }
        //             })
        //         }
        //
        //     })
        // }
        function moveSlider(slides, direction) {
            if (direction === "left") {
                --current;
                if (current < 0) current = slides.length - 1;
            } else if (direction === "right") {
                ++current;
                if (current > slides.length - 1) current = 0;
            }

            slides.forEach((slide, i) => {
                slide.classList.toggle("_active", i === current);
                slide.querySelector(".predict__team1").classList.remove("left-anim");
                slide.querySelector(".predict__team2").classList.remove("right-anim");
            });

            SlideIconsInit(slidesIcons, current);
        }

        function SlideIconsInit(icons, current) {
            const wrapper = icons[0].parentElement.parentElement;
            // console.log(wrapper)

            icons.forEach((icon, iconIndex) => {
                icon.classList.toggle("_current", current === iconIndex);
                if (current === iconIndex) {
                    const iconOffsetLeft = icon.offsetLeft;
                    const iconWidth = icon.offsetWidth;
                    const wrapperWidth = wrapper.offsetWidth;
                    wrapper.scrollTo({
                        left: iconOffsetLeft - (wrapperWidth / 2) + (iconWidth / 2),
                        behavior: 'smooth'
                    });
                }
            });
        }

        function handleClick(direction) {
            slides.forEach(slide =>{
                const leftCard = slide.querySelector(".predict__team1")
                const rightCard = slide.querySelector(".predict__team2")
                const leftCardBack = leftCard.querySelector(".back-img")
                const rightCardBack = rightCard.querySelector(".back-img")
                leftCard.classList.add("left-anim");
                rightCard.classList.add("right-anim");
                console.log( current - 1, slides.length)
                if(current + 1 < slides.length && direction === "right"){
                    leftCardBack.style.background = `url("../img/predict/left-team-desc${current + 2}.png") no-repeat 0 0/contain`
                    rightCardBack.style.background = `url("../img/predict/right-team-desc${current + 2}.png") no-repeat 0 0/contain`

                }else if (current + 1 === slides.length && direction === "right"){
                    leftCardBack.style.background = `url("../img/predict/left-team-desc1.png") no-repeat 0 0/contain`
                    rightCardBack.style.background = `url("../img/predict/right-team-desc1.png") no-repeat 0 0/contain`
                }
                if(current - 1 > 1 && direction === "left"){
                    leftCardBack.style.background = `url("../img/predict/left-team-desc${current }.png") no-repeat 0 0/contain`
                    rightCardBack.style.background = `url("../img/predict/right-team-desc${current }.png") no-repeat 0 0/contain`

                }else if (current - 1 === 0 && direction === "left"){
                    leftCardBack.style.background = `url("../img/predict/left-team-desc${slides.length}.png") no-repeat 0 0/contain`
                    rightCardBack.style.background = `url("../img/predict/right-team-desc${slides.length}.png") no-repeat 0 0/contain`
                }

            })
            rightBtn.style.pointerEvents = "none";
            leftBtn.style.pointerEvents = "none";
            setTimeout(() => {
                moveSlider(slides, direction);
                rightBtn.style.pointerEvents = "initial";
                leftBtn.style.pointerEvents = "initial";
                setScore(1)
                setScore(2)
                // initScoreSelector(1);
                // initScoreSelector(2);
                if(coverflow){
                    slides.forEach(slide =>{
                        slide.classList.remove("right-cover")
                        slide.classList.remove("left-cover")
                        slide.classList.remove("glitch")
                    })
                    coverFlowClasses("right-cover", "left-cover", slides)

                }
            }, 1000);
        }

        leftBtn.addEventListener("click", () => handleClick("left"));
        rightBtn.addEventListener("click", () => handleClick("right"));

        slidesIcons.forEach((icon, i) => {
            icon.addEventListener("click", (e) => {
                if(e.target.classList.contains("_current")) return
                setTimeout(() => {
                    slidesIcons.forEach(item => item.classList.remove("_current"));
                }, 1000);
                slidesIcons.forEach(icon =>{
                    icon.style.pointerEvents = "none"

                })
                rightBtn.style.pointerEvents = "none";
                leftBtn.style.pointerEvents = "none";

                slides[current].classList.add("glitch");
                current = i;
                slides.forEach(slide =>{
                    const leftCard = slide.querySelector(".predict__team1")
                    const rightCard = slide.querySelector(".predict__team2")
                    const leftCardBack = leftCard.querySelector(".back-img")
                    const rightCardBack = rightCard.querySelector(".back-img")
                    leftCard.classList.add("left-anim");
                    rightCard.classList.add("right-anim");
                    leftCardBack.style.background = `url("../img/predict/left-team-desc${current + 1}.png") no-repeat 0 0/contain`
                    rightCardBack.style.background = `url("../img/predict/right-team-desc${current + 1}.png") no-repeat 0 0/contain`
                })
                setTimeout(() => {
                    SlideIconsInit(slidesIcons, current);
                    slides.forEach((slide, index) => {
                        slide.classList.toggle("_active", index === current);
                        const leftCard = slide.querySelector(".predict__team1")
                        const rightCard = slide.querySelector(".predict__team2")
                        leftCard.classList.remove("left-anim");
                        rightCard.classList.remove("right-anim");
                        // slide.classList.remove("glitch");
                        // subtitlesInit(subtitles, slides)
                    });
                    rightBtn.style.pointerEvents = "initial";
                    leftBtn.style.pointerEvents = "initial";
                    slidesIcons.forEach(icon =>{
                        icon.style.pointerEvents = "initial"

                    })
                    setScore(1)
                    setScore(2)

                }, 1000);
            });
        });
        SlideIconsInit(slidesIcons, current);
        // subtitlesInit(subtitles, slides)

    }

    createSlider(".predict__counter", ".predict__move-left", ".predict__move-right", ".predict__icons-item", 1, null, "pers.png", null, false, null, null, true)

})();
