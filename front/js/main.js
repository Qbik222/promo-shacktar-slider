document.addEventListener("DOMContentLoaded", () =>{
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

    // score counter
    let team1 = 0;
    let team2 = 0;

    function setScore(score, scoreContainer, decreaseBtn, increaseBtn){
        scoreContainer = document.querySelector(`${scoreContainer}`)
        decreaseBtn = document.querySelector(`${decreaseBtn}`)
        increaseBtn = document.querySelector(`${increaseBtn}`)

        scoreContainer.innerText = score
        increaseBtn.addEventListener("click", () =>{
            ++score
            scoreContainer.innerText = score
        })
        decreaseBtn.addEventListener("click", () =>{
            if(score === 0) return
            --score
            scoreContainer.innerText = score
        })
    }

    setScore(team1, ".predict__score-team1", ".predict__team1-decrease", ".predict__team1-increase")
    setScore(team2, ".predict__score-team2", ".predict__team2-decrease", ".predict__team2-increase")

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
            threshold: 0.5
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

    //for test
    document.querySelector(".enBtn").addEventListener("click", () =>{
        document.querySelector(".fav-page").classList.toggle("en")
    })

})