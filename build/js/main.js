"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(function () {
  var PROMO_END_DATE = new Date('2024-10-22T18:30:00.000Z'); //-3 hours
  var apiURL = 'https://fav-prom.com/api_shakhtar_predictor';
  var resultsTable = document.querySelector('.table__body-scroll'),
    unauthMsgs = document.querySelectorAll('.unauth-msg'),
    youAreInBtns = document.querySelectorAll('.took-part'),
    predictionBtn = document.querySelector('.predict__btn'),
    yourBetTxt = document.querySelector('.predict__yourBet');
  var ukLeng = document.querySelector('#ukLeng');
  var enLeng = document.querySelector('#enLeng');
  var locale = 'uk';
  if (ukLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  var userId;
  // userId = 100300268

  function loadTranslations() {
    return fetch("".concat(apiURL, "/translates/").concat(locale)).then(function (res) {
      return res.json();
    }).then(function (json) {
      i18nData = json;
      translate();
      var mutationObserver = new MutationObserver(function (mutations) {
        translate();
      });
      mutationObserver.observe(document.getElementById('shakhtar'), {
        childList: true,
        subtree: true
      });
    });
  }
  function translate() {
    var elems = document.querySelectorAll('[data-translate]');
    if (elems && elems.length) {
      elems.forEach(function (elem) {
        var key = elem.getAttribute('data-translate');
        elem.innerHTML = translateKey(key);
        elem.removeAttribute('data-translate');
      });
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
    for (var _i = 0, _arr = ['uk', 'en']; _i < _arr.length; _i++) {
      var lang = _arr[_i];
      element.classList.remove(baseCssClass + lang);
    }
    element.classList.add(baseCssClass + locale);
  }
  var request = function request(link, extraOptions) {
    return fetch(apiURL + link, _objectSpread({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, extraOptions || {})).then(function (res) {
      return res.json();
    });
  };
  function getUsers() {
    return request('/users');
  }
  var InitPage = function InitPage() {
    getUsers().then(function (users) {
      renderUsers(users);
      translate();
    });
  };
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
      var c = 0;
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
      var currentUser = userId && users.find(function (user) {
        return user.userid === currentUserId;
      });
      if (currentUser) {
        displayUser(currentUser, true, table);
      }
      users.forEach(function (user) {
        if (user.userid !== currentUserId) {
          displayUser(user, false, table);
        }
      });
    }
  }
  function displayUser(user, isCurrentUser, table) {
    var additionalUserRow = document.createElement('div');
    additionalUserRow.classList.add('table__row');
    if (isCurrentUser) {
      updateLastPrediction(user);
      additionalUserRow.classList.add('you');
    }
    additionalUserRow.innerHTML = "\n                        <div class=\"table__row-item\">".concat(isCurrentUser ? user.userid : maskUserId(user.userid), "</div>\n                        <div class=\"table__row-item\">").concat(formatDateString(user.lastForecast), "</div>\n                        <div class=\"table__row-item\">").concat(user.team1, ":").concat(user.team2, "</div>\n                        <div class=\"table__row-item\">**************</div>\n                    ");
    table.append(additionalUserRow);
  }
  function updateLastPrediction(data) {
    var team1Label = document.querySelector('.scoreTeam1');
    var team2Label = document.querySelector('.scoreTeam2');
    team1Label.innerHTML = data.team1;
    team2Label.innerHTML = data.team2;

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
    var date = new Date(dateString);
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var year = date.getFullYear();
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    return "".concat(day, ".").concat(month, ".").concat(year, " / ").concat(hours, ":").concat(minutes);
  }

  // function maskUserId(userId) {
  //     return "**" + userId.toString().slice(2);
  // }
  //
  // let checkUserAuth = () => {
  //     if (userId) {
  //         unauthMsgs.forEach(item => item.classList.add('hide'));
  //         youAreInBtns.forEach(item => item.classList.remove('hide'));
  //     }
  // }

  var scorePrediction = [{
    team1: 0,
    team2: 0
  }, {
    team1: 0,
    team2: 0
  }, {
    team1: 0,
    team2: 0
  }, {
    team1: 0,
    team2: 0
  }, {
    team1: 0,
    team2: 0
  }];
  function setScore(teamNumber) {
    var scorePanels = document.querySelectorAll(".predictionTeam".concat(teamNumber));
    var fieldTag = "team".concat(teamNumber);
    scorePanels.forEach(function (panel, i) {
      panel.innerHTML = scorePrediction[i][fieldTag];
    });
  }
  function initScoreSelector(teamNumber) {
    var minusBtns = document.querySelectorAll(".team".concat(teamNumber, "-minus"));
    var plusBtns = document.querySelectorAll(".team".concat(teamNumber, "-plus"));
    var scorePanels = document.querySelectorAll(".predictionTeam".concat(teamNumber));
    var fieldTag = "team".concat(teamNumber);
    scorePanels.forEach(function (panel, i) {
      panel.innerHTML = scorePrediction[i][fieldTag];
    });
    minusBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var currentScore = scorePrediction[i][fieldTag];
        console.log(scorePrediction);
        scorePrediction[i][fieldTag] = Math.max(currentScore - 1, 0);
        scorePanels.forEach(function (panel) {
          panel.innerHTML = scorePrediction[i][fieldTag];
        });
      });
    });
    plusBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        // const fieldTag = `team${teamNumber}`;
        var currentScore = scorePrediction[i][fieldTag];
        scorePrediction[i][fieldTag] = Math.min(currentScore + 1, 99);
        scorePanels.forEach(function (panel) {
          panel.innerHTML = scorePrediction[i][fieldTag];
        });
      });
    });
  }
  var isRequestInProgress;
  function initPredictionBtn() {
    document.addEventListener('click', function (e) {
      if (!!e.target.closest('.predict__btn')) {
        if (isRequestInProgress) {
          return;
        }
        yourBetTxt.classList.remove("hide");
        setTimeout(function () {
          youAreInBtns.forEach(function (item) {
            return item.classList.remove('showBtn');
          });
        }, 5000);
        youAreInBtns.forEach(function (item) {
          return item.classList.add('showBtn');
        });
        isRequestInProgress = true;
        predictionBtn.classList.add("pointer-none");
        request('/bet', {
          method: 'POST',
          body: JSON.stringify({
            userid: userId,
            team1: scorePrediction.team1,
            team2: scorePrediction.team2
          })
        }).then(function (res) {
          isRequestInProgress = false;
          predictionBtn.classList.remove("pointer-none");
          InitPage();
        })["catch"](function (e) {
          isRequestInProgress = false;
          predictionBtn.classList.remove("pointer-none");
        });
      }
    });
  }
  loadTranslations().then(init);
  var mainPage = document.querySelector('.fav-page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);
  var currentDate = new Date();
  if (currentDate >= PROMO_END_DATE) {
    youAreInBtns.forEach(function (item) {
      return item.classList.add('block-btn');
    });
  }

  // popups
  function setPopups(popups, closeBtns, showBtns) {
    popups = document.querySelectorAll("".concat(popups));
    closeBtns = document.querySelectorAll("".concat(closeBtns));
    showBtns = document.querySelectorAll("".concat(showBtns));
    showBtns.forEach(function (showBtn, showBtnIndex) {
      showBtn.addEventListener("click", function () {
        popups.forEach(function (popup, popupIndex) {
          if (popupIndex === showBtnIndex) {
            popup.classList.toggle("active");
          } else {
            popup.classList.remove("active");
          }
        });
      });
    });
    closeBtns.forEach(function (showBtn, closeBtnIndex) {
      showBtn.addEventListener("click", function () {
        popups.forEach(function (popup, popupIndex) {
          if (popupIndex === closeBtnIndex) {
            popup.classList.remove("active");
          }
        });
      });
    });
  }
  setPopups(".guide__list-popup", ".guide__list-popup-close", ".guide__list-btn");

  // scroll add anim

  var tableLightning = document.querySelector('.table');
  var tableCup = document.querySelector('.table__cup');
  var tablePers = document.querySelector('.table__pers');
  var prizeLightning = document.querySelector('.prize');
  var promoTitle = document.querySelector('.promo__title');
  function animateOnScroll(element, animationClass) {
    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
        } else {
          entry.target.classList.remove(animationClass);
        }
      });
    }, options);
    observer.observe(element);
  }
  animateOnScroll(tableLightning, "tableLightning");
  animateOnScroll(tableCup, "fadeInLeft");
  animateOnScroll(tablePers, "fadeInRight");
  animateOnScroll(prizeLightning, "prizeLightning");
  var titles = document.querySelectorAll(".title");
  titles.forEach(function (title) {
    animateOnScroll(title, "fadeIn");
  });

  /// гліч слайдер
  function createSlider(slides, leftBtn, rightBtn, slidesIcons, current, path, img, week, coverflow, coverflowOffWidth, subtitles, copySlides) {
    var coverflowToggler = true;
    if (window.innerWidth < coverflowOffWidth) {
      coverflowToggler = false;
    }
    function coverFlowClasses(right, left, slides) {
      slides.forEach(function (slide, i) {
        if (coverflowToggler) {
          if (current === i) {
            var prevIndex = (i - 1 + slides.length) % slides.length;
            slides[prevIndex].classList.add(right);
            var nextIndex = (i + 1) % slides.length;
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
    var glitchLayers = [];
    slides.forEach(function (slide) {
      glitchLayers = [].concat(_toConsumableArray(glitchLayers), _toConsumableArray(slide.querySelectorAll(".glitch__layer")));
    });
    if (slides[current]) slides[current].classList.add("_active");
    if (coverflow) {
      coverFlowClasses("right-cover", "left-cover", slides);
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
      slides.forEach(function (slide, i) {
        slide.classList.toggle("_active", i === current);
        slide.querySelector(".predict__team1").classList.remove("left-anim");
        slide.querySelector(".predict__team2").classList.remove("right-anim");
      });
      SlideIconsInit(slidesIcons, current);
    }
    function SlideIconsInit(icons, current) {
      var wrapper = icons[0].parentElement.parentElement;
      // console.log(wrapper)

      icons.forEach(function (icon, iconIndex) {
        icon.classList.toggle("_current", current === iconIndex);
        if (current === iconIndex) {
          var iconOffsetLeft = icon.offsetLeft;
          var iconWidth = icon.offsetWidth;
          var wrapperWidth = wrapper.offsetWidth;
          wrapper.scrollTo({
            left: iconOffsetLeft - wrapperWidth / 2 + iconWidth / 2,
            behavior: 'smooth'
          });
        }
      });
    }
    function handleClick(direction) {
      slides.forEach(function (slide) {
        var leftCard = slide.querySelector(".predict__team1");
        var rightCard = slide.querySelector(".predict__team2");
        var leftCardBack = leftCard.querySelector(".back-img");
        var rightCardBack = rightCard.querySelector(".back-img");
        leftCard.classList.add("left-anim");
        rightCard.classList.add("right-anim");
        console.log(current - 1, slides.length);
        if (current + 1 < slides.length && direction === "right") {
          leftCardBack.style.background = "url(\"./img/predict/left-team-desc".concat(current + 2, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"./img/predict/right-team-desc".concat(current + 2, ".png\") no-repeat 0 0/contain");
        } else if (current + 1 === slides.length && direction === "right") {
          leftCardBack.style.background = "url(\"./img/predict/left-team-desc1.png\") no-repeat 0 0/contain";
          rightCardBack.style.background = "url(\"./img/predict/right-team-desc1.png\") no-repeat 0 0/contain";
        }
        if (current - 1 > 1 && direction === "left") {
          leftCardBack.style.background = "url(\"./img/predict/left-team-desc".concat(current, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"./img/predict/right-team-desc".concat(current, ".png\") no-repeat 0 0/contain");
        } else if (current - 1 === 0 && direction === "left") {
          leftCardBack.style.background = "url(\"./img/predict/left-team-desc".concat(slides.length, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"./img/predict/right-team-desc".concat(slides.length, ".png\") no-repeat 0 0/contain");
        }
      });
      rightBtn.style.pointerEvents = "none";
      leftBtn.style.pointerEvents = "none";
      setTimeout(function () {
        moveSlider(slides, direction);
        rightBtn.style.pointerEvents = "initial";
        leftBtn.style.pointerEvents = "initial";
        setScore(1);
        setScore(2);
        // initScoreSelector(1);
        // initScoreSelector(2);
        if (coverflow) {
          slides.forEach(function (slide) {
            slide.classList.remove("right-cover");
            slide.classList.remove("left-cover");
            slide.classList.remove("glitch");
          });
          coverFlowClasses("right-cover", "left-cover", slides);
        }
      }, 1000);
    }
    leftBtn.addEventListener("click", function () {
      return handleClick("left");
    });
    rightBtn.addEventListener("click", function () {
      return handleClick("right");
    });
    slidesIcons.forEach(function (icon, i) {
      icon.addEventListener("click", function (e) {
        if (e.target.classList.contains("_current")) return;
        setTimeout(function () {
          slidesIcons.forEach(function (item) {
            return item.classList.remove("_current");
          });
        }, 1000);
        slidesIcons.forEach(function (icon) {
          icon.style.pointerEvents = "none";
        });
        rightBtn.style.pointerEvents = "none";
        leftBtn.style.pointerEvents = "none";
        slides[current].classList.add("glitch");
        current = i;
        slides.forEach(function (slide) {
          var leftCard = slide.querySelector(".predict__team1");
          var rightCard = slide.querySelector(".predict__team2");
          var leftCardBack = leftCard.querySelector(".back-img");
          var rightCardBack = rightCard.querySelector(".back-img");
          leftCard.classList.add("left-anim");
          rightCard.classList.add("right-anim");
          leftCardBack.style.background = "url(\"./img/predict/left-team-desc".concat(current + 1, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"./img/predict/right-team-desc".concat(current + 1, ".png\") no-repeat 0 0/contain");
        });
        setTimeout(function () {
          SlideIconsInit(slidesIcons, current);
          slides.forEach(function (slide, index) {
            slide.classList.toggle("_active", index === current);
            var leftCard = slide.querySelector(".predict__team1");
            var rightCard = slide.querySelector(".predict__team2");
            leftCard.classList.remove("left-anim");
            rightCard.classList.remove("right-anim");
            // slide.classList.remove("glitch");
            // subtitlesInit(subtitles, slides)
          });

          rightBtn.style.pointerEvents = "initial";
          leftBtn.style.pointerEvents = "initial";
          slidesIcons.forEach(function (icon) {
            icon.style.pointerEvents = "initial";
          });
          setScore(1);
          setScore(2);
        }, 1000);
      });
    });
    SlideIconsInit(slidesIcons, current);
    // subtitlesInit(subtitles, slides)
  }

  createSlider(".predict__counter", ".predict__move-left", ".predict__move-right", ".predict__icons-item", 1, null, "pers.png", null, false, null, null, true);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiUFJPTU9fRU5EX0RBVEUiLCJEYXRlIiwiYXBpVVJMIiwicmVzdWx0c1RhYmxlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwidW5hdXRoTXNncyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ5b3VBcmVJbkJ0bnMiLCJwcmVkaWN0aW9uQnRuIiwieW91ckJldFR4dCIsInVrTGVuZyIsImVuTGVuZyIsImxvY2FsZSIsImkxOG5EYXRhIiwidXNlcklkIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwibGFuZyIsInJlbW92ZSIsInJlcXVlc3QiLCJsaW5rIiwiZXh0cmFPcHRpb25zIiwiaGVhZGVycyIsImdldFVzZXJzIiwiSW5pdFBhZ2UiLCJ1c2VycyIsInJlbmRlclVzZXJzIiwiaW5pdCIsImluaXRTY29yZVNlbGVjdG9yIiwiaW5pdFByZWRpY3Rpb25CdG4iLCJ3aW5kb3ciLCJzdG9yZSIsInN0YXRlIiwiZ2V0U3RhdGUiLCJhdXRoIiwiaXNBdXRob3JpemVkIiwiaWQiLCJjIiwiaSIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJwb3B1bGF0ZVVzZXJzVGFibGUiLCJjdXJyZW50VXNlcklkIiwidGFibGUiLCJjdXJyZW50VXNlciIsImZpbmQiLCJ1c2VyIiwidXNlcmlkIiwiZGlzcGxheVVzZXIiLCJpc0N1cnJlbnRVc2VyIiwiYWRkaXRpb25hbFVzZXJSb3ciLCJjcmVhdGVFbGVtZW50IiwidXBkYXRlTGFzdFByZWRpY3Rpb24iLCJtYXNrVXNlcklkIiwiZm9ybWF0RGF0ZVN0cmluZyIsImxhc3RGb3JlY2FzdCIsInRlYW0xIiwidGVhbTIiLCJhcHBlbmQiLCJkYXRhIiwidGVhbTFMYWJlbCIsInRlYW0yTGFiZWwiLCJkYXRlU3RyaW5nIiwiZGF0ZSIsImRheSIsImdldERhdGUiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwibW9udGgiLCJnZXRNb250aCIsInllYXIiLCJnZXRGdWxsWWVhciIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsInNjb3JlUHJlZGljdGlvbiIsInNldFNjb3JlIiwidGVhbU51bWJlciIsInNjb3JlUGFuZWxzIiwiZmllbGRUYWciLCJwYW5lbCIsIm1pbnVzQnRucyIsInBsdXNCdG5zIiwiYnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImN1cnJlbnRTY29yZSIsImNvbnNvbGUiLCJsb2ciLCJNYXRoIiwibWF4IiwibWluIiwiaXNSZXF1ZXN0SW5Qcm9ncmVzcyIsImUiLCJ0YXJnZXQiLCJjbG9zZXN0Iiwic2V0VGltZW91dCIsIml0ZW0iLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImN1cnJlbnREYXRlIiwic2V0UG9wdXBzIiwicG9wdXBzIiwiY2xvc2VCdG5zIiwic2hvd0J0bnMiLCJzaG93QnRuIiwic2hvd0J0bkluZGV4IiwicG9wdXAiLCJwb3B1cEluZGV4IiwidG9nZ2xlIiwiY2xvc2VCdG5JbmRleCIsInRhYmxlTGlnaHRuaW5nIiwidGFibGVDdXAiLCJ0YWJsZVBlcnMiLCJwcml6ZUxpZ2h0bmluZyIsInByb21vVGl0bGUiLCJhbmltYXRlT25TY3JvbGwiLCJhbmltYXRpb25DbGFzcyIsIm9wdGlvbnMiLCJyb290Iiwicm9vdE1hcmdpbiIsInRocmVzaG9sZCIsIm9ic2VydmVyIiwiSW50ZXJzZWN0aW9uT2JzZXJ2ZXIiLCJlbnRyaWVzIiwiZW50cnkiLCJpc0ludGVyc2VjdGluZyIsInRpdGxlcyIsInRpdGxlIiwiY3JlYXRlU2xpZGVyIiwic2xpZGVzIiwibGVmdEJ0biIsInJpZ2h0QnRuIiwic2xpZGVzSWNvbnMiLCJjdXJyZW50IiwicGF0aCIsImltZyIsIndlZWsiLCJjb3ZlcmZsb3ciLCJjb3ZlcmZsb3dPZmZXaWR0aCIsInN1YnRpdGxlcyIsImNvcHlTbGlkZXMiLCJjb3ZlcmZsb3dUb2dnbGVyIiwiaW5uZXJXaWR0aCIsImNvdmVyRmxvd0NsYXNzZXMiLCJyaWdodCIsImxlZnQiLCJzbGlkZSIsInByZXZJbmRleCIsIm5leHRJbmRleCIsImdsaXRjaExheWVycyIsIm1vdmVTbGlkZXIiLCJkaXJlY3Rpb24iLCJTbGlkZUljb25zSW5pdCIsImljb25zIiwid3JhcHBlciIsInBhcmVudEVsZW1lbnQiLCJpY29uIiwiaWNvbkluZGV4IiwiaWNvbk9mZnNldExlZnQiLCJvZmZzZXRMZWZ0IiwiaWNvbldpZHRoIiwib2Zmc2V0V2lkdGgiLCJ3cmFwcGVyV2lkdGgiLCJzY3JvbGxUbyIsImJlaGF2aW9yIiwiaGFuZGxlQ2xpY2siLCJsZWZ0Q2FyZCIsInJpZ2h0Q2FyZCIsImxlZnRDYXJkQmFjayIsInJpZ2h0Q2FyZEJhY2siLCJzdHlsZSIsImJhY2tncm91bmQiLCJwb2ludGVyRXZlbnRzIiwiY29udGFpbnMiLCJpbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFlBQVk7RUFDVCxJQUFNQSxjQUFjLEdBQUcsSUFBSUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztFQUM3RCxJQUFNQyxNQUFNLEdBQUcsNkNBQTZDO0VBRTVELElBQ0lDLFlBQVksR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMscUJBQXFCLENBQUM7SUFDNURDLFVBQVUsR0FBR0YsUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7SUFDckRDLFlBQVksR0FBR0osUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7SUFDdERFLGFBQWEsR0FBR0wsUUFBUSxDQUFDQyxhQUFhLENBQUMsZUFBZSxDQUFDO0lBQ3ZESyxVQUFVLEdBQUdOLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0VBRTVELElBQU1NLE1BQU0sR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0VBQ2hELElBQU1PLE1BQU0sR0FBR1IsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0VBRWhELElBQUlRLE1BQU0sR0FBRyxJQUFJO0VBRWpCLElBQUlGLE1BQU0sRUFBRUUsTUFBTSxHQUFHLElBQUk7RUFDekIsSUFBSUQsTUFBTSxFQUFFQyxNQUFNLEdBQUcsSUFBSTtFQUV6QixJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCLElBQUlDLE1BQU07RUFDVjs7RUFFQSxTQUFTQyxnQkFBZ0IsR0FBRztJQUN4QixPQUFPQyxLQUFLLFdBQUlmLE1BQU0seUJBQWVXLE1BQU0sRUFBRyxDQUFDSyxJQUFJLENBQUMsVUFBQUMsR0FBRztNQUFBLE9BQUlBLEdBQUcsQ0FBQ0MsSUFBSSxFQUFFO0lBQUEsRUFBQyxDQUNqRUYsSUFBSSxDQUFDLFVBQUFFLElBQUksRUFBSTtNQUNWTixRQUFRLEdBQUdNLElBQUk7TUFDZkMsU0FBUyxFQUFFO01BRVgsSUFBSUMsZ0JBQWdCLEdBQUcsSUFBSUMsZ0JBQWdCLENBQUMsVUFBVUMsU0FBUyxFQUFFO1FBQzdESCxTQUFTLEVBQUU7TUFDZixDQUFDLENBQUM7TUFDRkMsZ0JBQWdCLENBQUNHLE9BQU8sQ0FBQ3JCLFFBQVEsQ0FBQ3NCLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUMxREMsU0FBUyxFQUFFLElBQUk7UUFDZkMsT0FBTyxFQUFFO01BQ2IsQ0FBQyxDQUFDO0lBRU4sQ0FBQyxDQUFDO0VBQ1Y7RUFFQSxTQUFTUCxTQUFTLEdBQUc7SUFDakIsSUFBTVEsS0FBSyxHQUFHekIsUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztJQUMzRCxJQUFJc0IsS0FBSyxJQUFJQSxLQUFLLENBQUNDLE1BQU0sRUFBRTtNQUN2QkQsS0FBSyxDQUFDRSxPQUFPLENBQUMsVUFBQUMsSUFBSSxFQUFJO1FBQ2xCLElBQU1DLEdBQUcsR0FBR0QsSUFBSSxDQUFDRSxZQUFZLENBQUMsZ0JBQWdCLENBQUM7UUFDL0NGLElBQUksQ0FBQ0csU0FBUyxHQUFHQyxZQUFZLENBQUNILEdBQUcsQ0FBQztRQUNsQ0QsSUFBSSxDQUFDSyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7TUFDMUMsQ0FBQyxDQUFDO0lBQ047SUFFQSxJQUFJeEIsTUFBTSxLQUFLLElBQUksRUFBRTtNQUNqQnlCLFFBQVEsQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ2hDO0lBRUFDLHFCQUFxQixFQUFFO0VBQzNCO0VBRUEsU0FBU0wsWUFBWSxDQUFDSCxHQUFHLEVBQUU7SUFDdkIsSUFBSSxDQUFDQSxHQUFHLEVBQUU7TUFDTjtJQUNKO0lBQ0EsT0FBT25CLFFBQVEsQ0FBQ21CLEdBQUcsQ0FBQyxJQUFJLDBDQUEwQyxHQUFHQSxHQUFHO0VBQzVFO0VBRUEsU0FBU1EscUJBQXFCLENBQUNDLE9BQU8sRUFBRUMsWUFBWSxFQUFFO0lBQ2xELElBQUksQ0FBQ0QsT0FBTyxFQUFFO01BQ1Y7SUFDSjtJQUNBLHdCQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsMEJBQUU7TUFBNUIsSUFBTUUsSUFBSTtNQUNYRixPQUFPLENBQUNILFNBQVMsQ0FBQ00sTUFBTSxDQUFDRixZQUFZLEdBQUdDLElBQUksQ0FBQztJQUNqRDtJQUNBRixPQUFPLENBQUNILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDRyxZQUFZLEdBQUc5QixNQUFNLENBQUM7RUFDaEQ7RUFFQSxJQUFNaUMsT0FBTyxHQUFHLFNBQVZBLE9BQU8sQ0FBYUMsSUFBSSxFQUFFQyxZQUFZLEVBQUU7SUFDMUMsT0FBTy9CLEtBQUssQ0FBQ2YsTUFBTSxHQUFHNkMsSUFBSTtNQUN0QkUsT0FBTyxFQUFFO1FBQ0wsUUFBUSxFQUFFLGtCQUFrQjtRQUM1QixjQUFjLEVBQUU7TUFDcEI7SUFBQyxHQUNHRCxZQUFZLElBQUksQ0FBQyxDQUFDLEVBQ3hCLENBQUM5QixJQUFJLENBQUMsVUFBQUMsR0FBRztNQUFBLE9BQUlBLEdBQUcsQ0FBQ0MsSUFBSSxFQUFFO0lBQUEsRUFBQztFQUM5QixDQUFDO0VBRUQsU0FBUzhCLFFBQVEsR0FBRztJQUNoQixPQUFPSixPQUFPLENBQUMsUUFBUSxDQUFDO0VBQzVCO0VBRUEsSUFBTUssUUFBUSxHQUFHLFNBQVhBLFFBQVEsR0FBUztJQUNuQkQsUUFBUSxFQUFFLENBQUNoQyxJQUFJLENBQUMsVUFBQWtDLEtBQUssRUFBSTtNQUNyQkMsV0FBVyxDQUFDRCxLQUFLLENBQUM7TUFDbEIvQixTQUFTLEVBQUU7SUFDZixDQUFDLENBQUM7RUFDTixDQUFDO0VBRUQsU0FBU2lDLElBQUksR0FBRztJQUNaQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDcEJBLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUNwQkMsaUJBQWlCLEVBQUU7SUFFbkIsSUFBSUMsTUFBTSxDQUFDQyxLQUFLLEVBQUU7TUFDZCxJQUFJQyxLQUFLLEdBQUdGLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDRSxRQUFRLEVBQUU7TUFDbkM3QyxNQUFNLEdBQUc0QyxLQUFLLENBQUNFLElBQUksQ0FBQ0MsWUFBWSxJQUFJSCxLQUFLLENBQUNFLElBQUksQ0FBQ0UsRUFBRSxJQUFJLEVBQUU7TUFDdkRaLFFBQVEsRUFBRTtJQUNkLENBQUMsTUFBTTtNQUNIQSxRQUFRLEVBQUU7TUFDVixJQUFJYSxDQUFDLEdBQUcsQ0FBQztNQUNULElBQUlDLENBQUMsR0FBR0MsV0FBVyxDQUFDLFlBQVk7UUFDNUIsSUFBSUYsQ0FBQyxHQUFHLEVBQUUsRUFBRTtVQUNSLElBQUksQ0FBQyxDQUFDUCxNQUFNLENBQUNVLFNBQVMsRUFBRTtZQUNwQnBELE1BQU0sR0FBRzBDLE1BQU0sQ0FBQ1UsU0FBUztZQUN6QmhCLFFBQVEsRUFBRTtZQUNWaUIsYUFBYSxFQUFFO1lBQ2ZDLGFBQWEsQ0FBQ0osQ0FBQyxDQUFDO1VBQ3BCO1FBQ0osQ0FBQyxNQUFNO1VBQ0hJLGFBQWEsQ0FBQ0osQ0FBQyxDQUFDO1FBQ3BCO01BQ0osQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNYO0lBRUFHLGFBQWEsRUFBRTtFQUNuQjtFQUVBLFNBQVNmLFdBQVcsQ0FBQ0QsS0FBSyxFQUFFO0lBQ3hCa0Isa0JBQWtCLENBQUNsQixLQUFLLEVBQUVyQyxNQUFNLEVBQUVaLFlBQVksQ0FBQztFQUNuRDtFQUVBLFNBQVNtRSxrQkFBa0IsQ0FBQ2xCLEtBQUssRUFBRW1CLGFBQWEsRUFBRUMsS0FBSyxFQUFFO0lBQ3JEQSxLQUFLLENBQUNyQyxTQUFTLEdBQUcsRUFBRTtJQUNwQixJQUFJaUIsS0FBSyxJQUFJQSxLQUFLLENBQUN0QixNQUFNLEVBQUU7TUFDdkIsSUFBTTJDLFdBQVcsR0FBRzFELE1BQU0sSUFBSXFDLEtBQUssQ0FBQ3NCLElBQUksQ0FBQyxVQUFBQyxJQUFJO1FBQUEsT0FBSUEsSUFBSSxDQUFDQyxNQUFNLEtBQUtMLGFBQWE7TUFBQSxFQUFDO01BQy9FLElBQUlFLFdBQVcsRUFBRTtRQUNiSSxXQUFXLENBQUNKLFdBQVcsRUFBRSxJQUFJLEVBQUVELEtBQUssQ0FBQztNQUN6QztNQUVBcEIsS0FBSyxDQUFDckIsT0FBTyxDQUFDLFVBQUM0QyxJQUFJLEVBQUs7UUFDcEIsSUFBSUEsSUFBSSxDQUFDQyxNQUFNLEtBQUtMLGFBQWEsRUFBRTtVQUMvQk0sV0FBVyxDQUFDRixJQUFJLEVBQUUsS0FBSyxFQUFFSCxLQUFLLENBQUM7UUFDbkM7TUFDSixDQUFDLENBQUM7SUFDTjtFQUNKO0VBRUEsU0FBU0ssV0FBVyxDQUFDRixJQUFJLEVBQUVHLGFBQWEsRUFBRU4sS0FBSyxFQUFFO0lBQzdDLElBQU1PLGlCQUFpQixHQUFHM0UsUUFBUSxDQUFDNEUsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUN2REQsaUJBQWlCLENBQUN4QyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxZQUFZLENBQUM7SUFDN0MsSUFBSXNDLGFBQWEsRUFBRTtNQUNmRyxvQkFBb0IsQ0FBQ04sSUFBSSxDQUFDO01BQzFCSSxpQkFBaUIsQ0FBQ3hDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUMxQztJQUVBdUMsaUJBQWlCLENBQUM1QyxTQUFTLHNFQUNvQjJDLGFBQWEsR0FBR0gsSUFBSSxDQUFDQyxNQUFNLEdBQUdNLFVBQVUsQ0FBQ1AsSUFBSSxDQUFDQyxNQUFNLENBQUMsNEVBQ3JETyxnQkFBZ0IsQ0FBQ1IsSUFBSSxDQUFDUyxZQUFZLENBQUMsNEVBQ25DVCxJQUFJLENBQUNVLEtBQUssY0FBSVYsSUFBSSxDQUFDVyxLQUFLLDhHQUUxRDtJQUNiZCxLQUFLLENBQUNlLE1BQU0sQ0FBQ1IsaUJBQWlCLENBQUM7RUFDbkM7RUFFQSxTQUFTRSxvQkFBb0IsQ0FBQ08sSUFBSSxFQUFFO0lBQ2hDLElBQU1DLFVBQVUsR0FBR3JGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUN4RCxJQUFNcUYsVUFBVSxHQUFHdEYsUUFBUSxDQUFDQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ3hEb0YsVUFBVSxDQUFDdEQsU0FBUyxHQUFHcUQsSUFBSSxDQUFDSCxLQUFLO0lBQ2pDSyxVQUFVLENBQUN2RCxTQUFTLEdBQUdxRCxJQUFJLENBQUNGLEtBQUs7O0lBRWpDO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtFQUNKOztFQUVBLFNBQVNILGdCQUFnQixDQUFDUSxVQUFVLEVBQUU7SUFDbEMsSUFBTUMsSUFBSSxHQUFHLElBQUkzRixJQUFJLENBQUMwRixVQUFVLENBQUM7SUFFakMsSUFBTUUsR0FBRyxHQUFHRCxJQUFJLENBQUNFLE9BQU8sRUFBRSxDQUFDQyxRQUFRLEVBQUUsQ0FBQ0MsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDdEQsSUFBTUMsS0FBSyxHQUFHLENBQUNMLElBQUksQ0FBQ00sUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFSCxRQUFRLEVBQUUsQ0FBQ0MsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDL0QsSUFBTUcsSUFBSSxHQUFHUCxJQUFJLENBQUNRLFdBQVcsRUFBRTtJQUMvQixJQUFNQyxLQUFLLEdBQUdULElBQUksQ0FBQ1UsUUFBUSxFQUFFLENBQUNQLFFBQVEsRUFBRSxDQUFDQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN6RCxJQUFNTyxPQUFPLEdBQUdYLElBQUksQ0FBQ1ksVUFBVSxFQUFFLENBQUNULFFBQVEsRUFBRSxDQUFDQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUU3RCxpQkFBVUgsR0FBRyxjQUFJSSxLQUFLLGNBQUlFLElBQUksZ0JBQU1FLEtBQUssY0FBSUUsT0FBTztFQUN4RDs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQSxJQUFNRSxlQUFlLEdBQUcsQ0FDcEI7SUFBQ3BCLEtBQUssRUFBRyxDQUFDO0lBQUVDLEtBQUssRUFBRTtFQUFDLENBQUMsRUFDckI7SUFBQ0QsS0FBSyxFQUFHLENBQUM7SUFBRUMsS0FBSyxFQUFFO0VBQUMsQ0FBQyxFQUNyQjtJQUFDRCxLQUFLLEVBQUcsQ0FBQztJQUFFQyxLQUFLLEVBQUU7RUFBQyxDQUFDLEVBQ3JCO0lBQUNELEtBQUssRUFBRyxDQUFDO0lBQUVDLEtBQUssRUFBRTtFQUFDLENBQUMsRUFDckI7SUFBQ0QsS0FBSyxFQUFHLENBQUM7SUFBRUMsS0FBSyxFQUFFO0VBQUMsQ0FBQyxDQUN4QjtFQUVELFNBQVNvQixRQUFRLENBQUNDLFVBQVUsRUFBQztJQUN6QixJQUFNQyxXQUFXLEdBQUd4RyxRQUFRLENBQUNHLGdCQUFnQiwwQkFBbUJvRyxVQUFVLEVBQUc7SUFFN0UsSUFBTUUsUUFBUSxpQkFBVUYsVUFBVSxDQUFFO0lBRXBDQyxXQUFXLENBQUM3RSxPQUFPLENBQUMsVUFBQytFLEtBQUssRUFBRTdDLENBQUMsRUFBSTtNQUM3QjZDLEtBQUssQ0FBQzNFLFNBQVMsR0FBR3NFLGVBQWUsQ0FBQ3hDLENBQUMsQ0FBQyxDQUFDNEMsUUFBUSxDQUFDO0lBQ2xELENBQUMsQ0FBQztFQUNOO0VBRUEsU0FBU3RELGlCQUFpQixDQUFDb0QsVUFBVSxFQUFFO0lBQ25DLElBQU1JLFNBQVMsR0FBRzNHLFFBQVEsQ0FBQ0csZ0JBQWdCLGdCQUFTb0csVUFBVSxZQUFTO0lBQ3ZFLElBQU1LLFFBQVEsR0FBRzVHLFFBQVEsQ0FBQ0csZ0JBQWdCLGdCQUFTb0csVUFBVSxXQUFRO0lBQ3JFLElBQU1DLFdBQVcsR0FBR3hHLFFBQVEsQ0FBQ0csZ0JBQWdCLDBCQUFtQm9HLFVBQVUsRUFBRztJQUU3RSxJQUFNRSxRQUFRLGlCQUFVRixVQUFVLENBQUU7SUFFcENDLFdBQVcsQ0FBQzdFLE9BQU8sQ0FBQyxVQUFDK0UsS0FBSyxFQUFFN0MsQ0FBQyxFQUFJO01BQzdCNkMsS0FBSyxDQUFDM0UsU0FBUyxHQUFHc0UsZUFBZSxDQUFDeEMsQ0FBQyxDQUFDLENBQUM0QyxRQUFRLENBQUM7SUFDbEQsQ0FBQyxDQUFDO0lBR0ZFLFNBQVMsQ0FBQ2hGLE9BQU8sQ0FBQyxVQUFDa0YsR0FBRyxFQUFFaEQsQ0FBQyxFQUFLO01BQzFCZ0QsR0FBRyxDQUFDQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtRQUVoQyxJQUFNQyxZQUFZLEdBQUdWLGVBQWUsQ0FBQ3hDLENBQUMsQ0FBQyxDQUFDNEMsUUFBUSxDQUFDO1FBQ2pETyxPQUFPLENBQUNDLEdBQUcsQ0FBQ1osZUFBZSxDQUFDO1FBQzVCQSxlQUFlLENBQUN4QyxDQUFDLENBQUMsQ0FBQzRDLFFBQVEsQ0FBQyxHQUFHUyxJQUFJLENBQUNDLEdBQUcsQ0FBQ0osWUFBWSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNURQLFdBQVcsQ0FBQzdFLE9BQU8sQ0FBQyxVQUFBK0UsS0FBSyxFQUFHO1VBQ3hCQSxLQUFLLENBQUMzRSxTQUFTLEdBQUdzRSxlQUFlLENBQUN4QyxDQUFDLENBQUMsQ0FBQzRDLFFBQVEsQ0FBQztRQUNsRCxDQUFDLENBQUM7TUFFTixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFHRkcsUUFBUSxDQUFDakYsT0FBTyxDQUFDLFVBQUNrRixHQUFHLEVBQUVoRCxDQUFDLEVBQUk7TUFDeEJnRCxHQUFHLENBQUNDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO1FBQ2hDO1FBQ0EsSUFBTUMsWUFBWSxHQUFHVixlQUFlLENBQUN4QyxDQUFDLENBQUMsQ0FBQzRDLFFBQVEsQ0FBQztRQUNqREosZUFBZSxDQUFDeEMsQ0FBQyxDQUFDLENBQUM0QyxRQUFRLENBQUMsR0FBR1MsSUFBSSxDQUFDRSxHQUFHLENBQUNMLFlBQVksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzdEUCxXQUFXLENBQUM3RSxPQUFPLENBQUMsVUFBQStFLEtBQUssRUFBRztVQUN4QkEsS0FBSyxDQUFDM0UsU0FBUyxHQUFHc0UsZUFBZSxDQUFDeEMsQ0FBQyxDQUFDLENBQUM0QyxRQUFRLENBQUM7UUFDbEQsQ0FBQyxDQUFDO01BQ04sQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0VBRU47RUFFQSxJQUFJWSxtQkFBbUI7RUFDdkIsU0FBU2pFLGlCQUFpQixHQUFHO0lBQ3pCcEQsUUFBUSxDQUFDOEcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNRLENBQUMsRUFBSztNQUN0QyxJQUFJLENBQUMsQ0FBQ0EsQ0FBQyxDQUFDQyxNQUFNLENBQUNDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUNyQyxJQUFJSCxtQkFBbUIsRUFBRTtVQUNyQjtRQUNKO1FBQ0EvRyxVQUFVLENBQUM2QixTQUFTLENBQUNNLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbkNnRixVQUFVLENBQUMsWUFBVztVQUNsQnJILFlBQVksQ0FBQ3VCLE9BQU8sQ0FBQyxVQUFBK0YsSUFBSTtZQUFBLE9BQUlBLElBQUksQ0FBQ3ZGLFNBQVMsQ0FBQ00sTUFBTSxDQUFDLFNBQVMsQ0FBQztVQUFBLEVBQUM7UUFDbEUsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUNSckMsWUFBWSxDQUFDdUIsT0FBTyxDQUFDLFVBQUErRixJQUFJO1VBQUEsT0FBSUEsSUFBSSxDQUFDdkYsU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQUEsRUFBQztRQUMzRGlGLG1CQUFtQixHQUFHLElBQUk7UUFDMUJoSCxhQUFhLENBQUM4QixTQUFTLENBQUNDLEdBQUcsQ0FBQyxjQUFjLENBQUM7UUFDM0NNLE9BQU8sQ0FBQyxNQUFNLEVBQUU7VUFDWmlGLE1BQU0sRUFBRSxNQUFNO1VBQ2RDLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7WUFDakJ0RCxNQUFNLEVBQUU3RCxNQUFNO1lBQ2RzRSxLQUFLLEVBQUVvQixlQUFlLENBQUNwQixLQUFLO1lBQzVCQyxLQUFLLEVBQUVtQixlQUFlLENBQUNuQjtVQUMzQixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUNwRSxJQUFJLENBQUMsVUFBQUMsR0FBRyxFQUFJO1VBQ1hzRyxtQkFBbUIsR0FBRyxLQUFLO1VBQzNCaEgsYUFBYSxDQUFDOEIsU0FBUyxDQUFDTSxNQUFNLENBQUMsY0FBYyxDQUFDO1VBQzlDTSxRQUFRLEVBQUU7UUFDZCxDQUFDLENBQUMsU0FBTSxDQUFDLFVBQUF1RSxDQUFDLEVBQUk7VUFDVkQsbUJBQW1CLEdBQUcsS0FBSztVQUMzQmhILGFBQWEsQ0FBQzhCLFNBQVMsQ0FBQ00sTUFBTSxDQUFDLGNBQWMsQ0FBQztRQUNsRCxDQUFDLENBQUM7TUFDTjtJQUNKLENBQUMsQ0FBQztFQUNOO0VBR0E3QixnQkFBZ0IsRUFBRSxDQUNiRSxJQUFJLENBQUNvQyxJQUFJLENBQUM7RUFFZixJQUFJaEIsUUFBUSxHQUFHbEMsUUFBUSxDQUFDQyxhQUFhLENBQUMsV0FBVyxDQUFDO0VBQ2xEd0gsVUFBVSxDQUFDO0lBQUEsT0FBTXZGLFFBQVEsQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO0VBQUEsR0FBRSxJQUFJLENBQUM7RUFFMUQsSUFBTTJGLFdBQVcsR0FBRyxJQUFJbEksSUFBSSxFQUFFO0VBQzlCLElBQUdrSSxXQUFXLElBQUluSSxjQUFjLEVBQUU7SUFDOUJRLFlBQVksQ0FBQ3VCLE9BQU8sQ0FBQyxVQUFBK0YsSUFBSTtNQUFBLE9BQUlBLElBQUksQ0FBQ3ZGLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUFBLEVBQUM7RUFDakU7O0VBRUE7RUFDQSxTQUFTNEYsU0FBUyxDQUFDQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsUUFBUSxFQUFDO0lBQzNDRixNQUFNLEdBQUdqSSxRQUFRLENBQUNHLGdCQUFnQixXQUFJOEgsTUFBTSxFQUFHO0lBQy9DQyxTQUFTLEdBQUdsSSxRQUFRLENBQUNHLGdCQUFnQixXQUFJK0gsU0FBUyxFQUFHO0lBQ3JEQyxRQUFRLEdBQUduSSxRQUFRLENBQUNHLGdCQUFnQixXQUFJZ0ksUUFBUSxFQUFHO0lBRW5EQSxRQUFRLENBQUN4RyxPQUFPLENBQUMsVUFBQ3lHLE9BQU8sRUFBRUMsWUFBWSxFQUFLO01BQ3hDRCxPQUFPLENBQUN0QixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBSztRQUNuQ21CLE1BQU0sQ0FBQ3RHLE9BQU8sQ0FBQyxVQUFDMkcsS0FBSyxFQUFFQyxVQUFVLEVBQUk7VUFDakMsSUFBR0EsVUFBVSxLQUFLRixZQUFZLEVBQUM7WUFDM0JDLEtBQUssQ0FBQ25HLFNBQVMsQ0FBQ3FHLE1BQU0sQ0FBQyxRQUFRLENBQUM7VUFDcEMsQ0FBQyxNQUFJO1lBQ0RGLEtBQUssQ0FBQ25HLFNBQVMsQ0FBQ00sTUFBTSxDQUFDLFFBQVEsQ0FBQztVQUNwQztRQUNKLENBQUMsQ0FBQztNQUNOLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUNGeUYsU0FBUyxDQUFDdkcsT0FBTyxDQUFDLFVBQUN5RyxPQUFPLEVBQUVLLGFBQWEsRUFBSztNQUMxQ0wsT0FBTyxDQUFDdEIsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQUs7UUFDbkNtQixNQUFNLENBQUN0RyxPQUFPLENBQUMsVUFBQzJHLEtBQUssRUFBRUMsVUFBVSxFQUFJO1VBQ2pDLElBQUdBLFVBQVUsS0FBS0UsYUFBYSxFQUFDO1lBQzVCSCxLQUFLLENBQUNuRyxTQUFTLENBQUNNLE1BQU0sQ0FBQyxRQUFRLENBQUM7VUFDcEM7UUFDSixDQUFDLENBQUM7TUFDTixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7RUFFTjtFQUVBdUYsU0FBUyxDQUFDLG9CQUFvQixFQUFFLDBCQUEwQixFQUFFLGtCQUFrQixDQUFDOztFQUUvRTs7RUFFQSxJQUFNVSxjQUFjLEdBQUcxSSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7RUFDdkQsSUFBTTBJLFFBQVEsR0FBRzNJLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGFBQWEsQ0FBQztFQUN0RCxJQUFNMkksU0FBUyxHQUFHNUksUUFBUSxDQUFDQyxhQUFhLENBQUMsY0FBYyxDQUFDO0VBQ3hELElBQU00SSxjQUFjLEdBQUc3SSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7RUFDdkQsSUFBTTZJLFVBQVUsR0FBRzlJLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGVBQWUsQ0FBQztFQUUxRCxTQUFTOEksZUFBZSxDQUFDekcsT0FBTyxFQUFFMEcsY0FBYyxFQUFFO0lBQzlDLElBQU1DLE9BQU8sR0FBRztNQUNaQyxJQUFJLEVBQUUsSUFBSTtNQUNWQyxVQUFVLEVBQUUsS0FBSztNQUNqQkMsU0FBUyxFQUFFO0lBQ2YsQ0FBQztJQUVELElBQU1DLFFBQVEsR0FBRyxJQUFJQyxvQkFBb0IsQ0FBQyxVQUFDQyxPQUFPLEVBQUs7TUFDbkRBLE9BQU8sQ0FBQzVILE9BQU8sQ0FBQyxVQUFBNkgsS0FBSyxFQUFJO1FBQ3JCLElBQUlBLEtBQUssQ0FBQ0MsY0FBYyxFQUFFO1VBQ3RCRCxLQUFLLENBQUNqQyxNQUFNLENBQUNwRixTQUFTLENBQUNDLEdBQUcsQ0FBQzRHLGNBQWMsQ0FBQztRQUM5QyxDQUFDLE1BQU07VUFDSFEsS0FBSyxDQUFDakMsTUFBTSxDQUFDcEYsU0FBUyxDQUFDTSxNQUFNLENBQUN1RyxjQUFjLENBQUM7UUFDakQ7TUFDSixDQUFDLENBQUM7SUFDTixDQUFDLEVBQUVDLE9BQU8sQ0FBQztJQUVYSSxRQUFRLENBQUNoSSxPQUFPLENBQUNpQixPQUFPLENBQUM7RUFDN0I7RUFDQXlHLGVBQWUsQ0FBQ0wsY0FBYyxFQUFFLGdCQUFnQixDQUFDO0VBQ2pESyxlQUFlLENBQUNKLFFBQVEsRUFBRSxZQUFZLENBQUM7RUFDdkNJLGVBQWUsQ0FBQ0gsU0FBUyxFQUFFLGFBQWEsQ0FBQztFQUN6Q0csZUFBZSxDQUFDRixjQUFjLEVBQUUsZ0JBQWdCLENBQUM7RUFFakQsSUFBTWEsTUFBTSxHQUFHMUosUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7RUFFbER1SixNQUFNLENBQUMvSCxPQUFPLENBQUMsVUFBQWdJLEtBQUssRUFBRztJQUNuQlosZUFBZSxDQUFDWSxLQUFLLEVBQUUsUUFBUSxDQUFDO0VBQ3BDLENBQUMsQ0FBQzs7RUFJRjtFQUNBLFNBQVNDLFlBQVksQ0FBQ0MsTUFBTSxFQUFFQyxPQUFPLEVBQUVDLFFBQVEsRUFBRUMsV0FBVyxFQUFFQyxPQUFPLEVBQUVDLElBQUksRUFBRUMsR0FBRyxFQUFFQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsaUJBQWlCLEVBQUVDLFNBQVMsRUFBRUMsVUFBVSxFQUFDO0lBQ3hJLElBQUlDLGdCQUFnQixHQUFHLElBQUk7SUFDM0IsSUFBR3BILE1BQU0sQ0FBQ3FILFVBQVUsR0FBR0osaUJBQWlCLEVBQUM7TUFDckNHLGdCQUFnQixHQUFHLEtBQUs7SUFDNUI7SUFDQSxTQUFTRSxnQkFBZ0IsQ0FBQ0MsS0FBSyxFQUFFQyxJQUFJLEVBQUVoQixNQUFNLEVBQUU7TUFDM0NBLE1BQU0sQ0FBQ2xJLE9BQU8sQ0FBQyxVQUFDbUosS0FBSyxFQUFFakgsQ0FBQyxFQUFLO1FBQ3pCLElBQUk0RyxnQkFBZ0IsRUFBRTtVQUNsQixJQUFJUixPQUFPLEtBQUtwRyxDQUFDLEVBQUU7WUFDZixJQUFJa0gsU0FBUyxHQUFHLENBQUNsSCxDQUFDLEdBQUcsQ0FBQyxHQUFHZ0csTUFBTSxDQUFDbkksTUFBTSxJQUFJbUksTUFBTSxDQUFDbkksTUFBTTtZQUN2RG1JLE1BQU0sQ0FBQ2tCLFNBQVMsQ0FBQyxDQUFDNUksU0FBUyxDQUFDQyxHQUFHLENBQUN3SSxLQUFLLENBQUM7WUFDdEMsSUFBSUksU0FBUyxHQUFHLENBQUNuSCxDQUFDLEdBQUcsQ0FBQyxJQUFJZ0csTUFBTSxDQUFDbkksTUFBTTtZQUN2Q21JLE1BQU0sQ0FBQ21CLFNBQVMsQ0FBQyxDQUFDN0ksU0FBUyxDQUFDQyxHQUFHLENBQUN5SSxJQUFJLENBQUM7VUFDekM7UUFDSjtNQUNKLENBQUMsQ0FBQztJQUNOO0lBRUFoQixNQUFNLEdBQUc3SixRQUFRLENBQUNHLGdCQUFnQixDQUFDMEosTUFBTSxDQUFDO0lBQzFDVSxTQUFTLEdBQUd2SyxRQUFRLENBQUNHLGdCQUFnQixDQUFDb0ssU0FBUyxDQUFDO0lBQ2hEVCxPQUFPLEdBQUc5SixRQUFRLENBQUNDLGFBQWEsQ0FBQzZKLE9BQU8sQ0FBQztJQUN6Q0MsUUFBUSxHQUFHL0osUUFBUSxDQUFDQyxhQUFhLENBQUM4SixRQUFRLENBQUM7SUFDM0NDLFdBQVcsR0FBR2hLLFFBQVEsQ0FBQ0csZ0JBQWdCLENBQUM2SixXQUFXLENBQUM7SUFDcEQsSUFBSWlCLFlBQVksR0FBRyxFQUFFO0lBQ3JCcEIsTUFBTSxDQUFDbEksT0FBTyxDQUFDLFVBQUFtSixLQUFLLEVBQUk7TUFDcEJHLFlBQVksZ0NBQU9BLFlBQVksc0JBQUtILEtBQUssQ0FBQzNLLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLEVBQUM7SUFDakYsQ0FBQyxDQUFDO0lBQ0YsSUFBRzBKLE1BQU0sQ0FBQ0ksT0FBTyxDQUFDLEVBQUNKLE1BQU0sQ0FBQ0ksT0FBTyxDQUFDLENBQUM5SCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxTQUFTLENBQUM7SUFDM0QsSUFBR2lJLFNBQVMsRUFBQztNQUNUTSxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFZCxNQUFNLENBQUM7SUFDekQ7O0lBRUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQVNxQixVQUFVLENBQUNyQixNQUFNLEVBQUVzQixTQUFTLEVBQUU7TUFDbkMsSUFBSUEsU0FBUyxLQUFLLE1BQU0sRUFBRTtRQUN0QixFQUFFbEIsT0FBTztRQUNULElBQUlBLE9BQU8sR0FBRyxDQUFDLEVBQUVBLE9BQU8sR0FBR0osTUFBTSxDQUFDbkksTUFBTSxHQUFHLENBQUM7TUFDaEQsQ0FBQyxNQUFNLElBQUl5SixTQUFTLEtBQUssT0FBTyxFQUFFO1FBQzlCLEVBQUVsQixPQUFPO1FBQ1QsSUFBSUEsT0FBTyxHQUFHSixNQUFNLENBQUNuSSxNQUFNLEdBQUcsQ0FBQyxFQUFFdUksT0FBTyxHQUFHLENBQUM7TUFDaEQ7TUFFQUosTUFBTSxDQUFDbEksT0FBTyxDQUFDLFVBQUNtSixLQUFLLEVBQUVqSCxDQUFDLEVBQUs7UUFDekJpSCxLQUFLLENBQUMzSSxTQUFTLENBQUNxRyxNQUFNLENBQUMsU0FBUyxFQUFFM0UsQ0FBQyxLQUFLb0csT0FBTyxDQUFDO1FBQ2hEYSxLQUFLLENBQUM3SyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQ2tDLFNBQVMsQ0FBQ00sTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNwRXFJLEtBQUssQ0FBQzdLLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDa0MsU0FBUyxDQUFDTSxNQUFNLENBQUMsWUFBWSxDQUFDO01BQ3pFLENBQUMsQ0FBQztNQUVGMkksY0FBYyxDQUFDcEIsV0FBVyxFQUFFQyxPQUFPLENBQUM7SUFDeEM7SUFFQSxTQUFTbUIsY0FBYyxDQUFDQyxLQUFLLEVBQUVwQixPQUFPLEVBQUU7TUFDcEMsSUFBTXFCLE9BQU8sR0FBR0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDRSxhQUFhLENBQUNBLGFBQWE7TUFDcEQ7O01BRUFGLEtBQUssQ0FBQzFKLE9BQU8sQ0FBQyxVQUFDNkosSUFBSSxFQUFFQyxTQUFTLEVBQUs7UUFDL0JELElBQUksQ0FBQ3JKLFNBQVMsQ0FBQ3FHLE1BQU0sQ0FBQyxVQUFVLEVBQUV5QixPQUFPLEtBQUt3QixTQUFTLENBQUM7UUFDeEQsSUFBSXhCLE9BQU8sS0FBS3dCLFNBQVMsRUFBRTtVQUN2QixJQUFNQyxjQUFjLEdBQUdGLElBQUksQ0FBQ0csVUFBVTtVQUN0QyxJQUFNQyxTQUFTLEdBQUdKLElBQUksQ0FBQ0ssV0FBVztVQUNsQyxJQUFNQyxZQUFZLEdBQUdSLE9BQU8sQ0FBQ08sV0FBVztVQUN4Q1AsT0FBTyxDQUFDUyxRQUFRLENBQUM7WUFDYmxCLElBQUksRUFBRWEsY0FBYyxHQUFJSSxZQUFZLEdBQUcsQ0FBRSxHQUFJRixTQUFTLEdBQUcsQ0FBRTtZQUMzREksUUFBUSxFQUFFO1VBQ2QsQ0FBQyxDQUFDO1FBQ047TUFDSixDQUFDLENBQUM7SUFDTjtJQUVBLFNBQVNDLFdBQVcsQ0FBQ2QsU0FBUyxFQUFFO01BQzVCdEIsTUFBTSxDQUFDbEksT0FBTyxDQUFDLFVBQUFtSixLQUFLLEVBQUc7UUFDbkIsSUFBTW9CLFFBQVEsR0FBR3BCLEtBQUssQ0FBQzdLLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztRQUN2RCxJQUFNa00sU0FBUyxHQUFHckIsS0FBSyxDQUFDN0ssYUFBYSxDQUFDLGlCQUFpQixDQUFDO1FBQ3hELElBQU1tTSxZQUFZLEdBQUdGLFFBQVEsQ0FBQ2pNLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFDeEQsSUFBTW9NLGFBQWEsR0FBR0YsU0FBUyxDQUFDbE0sYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUMxRGlNLFFBQVEsQ0FBQy9KLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQztRQUNuQytKLFNBQVMsQ0FBQ2hLLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFlBQVksQ0FBQztRQUNyQzRFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFFZ0QsT0FBTyxHQUFHLENBQUMsRUFBRUosTUFBTSxDQUFDbkksTUFBTSxDQUFDO1FBQ3hDLElBQUd1SSxPQUFPLEdBQUcsQ0FBQyxHQUFHSixNQUFNLENBQUNuSSxNQUFNLElBQUl5SixTQUFTLEtBQUssT0FBTyxFQUFDO1VBQ3BEaUIsWUFBWSxDQUFDRSxLQUFLLENBQUNDLFVBQVUsK0NBQXVDdEMsT0FBTyxHQUFHLENBQUMsa0NBQThCO1VBQzdHb0MsYUFBYSxDQUFDQyxLQUFLLENBQUNDLFVBQVUsZ0RBQXdDdEMsT0FBTyxHQUFHLENBQUMsa0NBQThCO1FBRW5ILENBQUMsTUFBSyxJQUFJQSxPQUFPLEdBQUcsQ0FBQyxLQUFLSixNQUFNLENBQUNuSSxNQUFNLElBQUl5SixTQUFTLEtBQUssT0FBTyxFQUFDO1VBQzdEaUIsWUFBWSxDQUFDRSxLQUFLLENBQUNDLFVBQVUscUVBQW1FO1VBQ2hHRixhQUFhLENBQUNDLEtBQUssQ0FBQ0MsVUFBVSxzRUFBb0U7UUFDdEc7UUFDQSxJQUFHdEMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUlrQixTQUFTLEtBQUssTUFBTSxFQUFDO1VBQ3ZDaUIsWUFBWSxDQUFDRSxLQUFLLENBQUNDLFVBQVUsK0NBQXVDdEMsT0FBTyxrQ0FBK0I7VUFDMUdvQyxhQUFhLENBQUNDLEtBQUssQ0FBQ0MsVUFBVSxnREFBd0N0QyxPQUFPLGtDQUErQjtRQUVoSCxDQUFDLE1BQUssSUFBSUEsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUlrQixTQUFTLEtBQUssTUFBTSxFQUFDO1VBQ2hEaUIsWUFBWSxDQUFDRSxLQUFLLENBQUNDLFVBQVUsK0NBQXVDMUMsTUFBTSxDQUFDbkksTUFBTSxrQ0FBOEI7VUFDL0cySyxhQUFhLENBQUNDLEtBQUssQ0FBQ0MsVUFBVSxnREFBd0MxQyxNQUFNLENBQUNuSSxNQUFNLGtDQUE4QjtRQUNySDtNQUVKLENBQUMsQ0FBQztNQUNGcUksUUFBUSxDQUFDdUMsS0FBSyxDQUFDRSxhQUFhLEdBQUcsTUFBTTtNQUNyQzFDLE9BQU8sQ0FBQ3dDLEtBQUssQ0FBQ0UsYUFBYSxHQUFHLE1BQU07TUFDcEMvRSxVQUFVLENBQUMsWUFBTTtRQUNieUQsVUFBVSxDQUFDckIsTUFBTSxFQUFFc0IsU0FBUyxDQUFDO1FBQzdCcEIsUUFBUSxDQUFDdUMsS0FBSyxDQUFDRSxhQUFhLEdBQUcsU0FBUztRQUN4QzFDLE9BQU8sQ0FBQ3dDLEtBQUssQ0FBQ0UsYUFBYSxHQUFHLFNBQVM7UUFDdkNsRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ1hBLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDWDtRQUNBO1FBQ0EsSUFBRytELFNBQVMsRUFBQztVQUNUUixNQUFNLENBQUNsSSxPQUFPLENBQUMsVUFBQW1KLEtBQUssRUFBRztZQUNuQkEsS0FBSyxDQUFDM0ksU0FBUyxDQUFDTSxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQ3JDcUksS0FBSyxDQUFDM0ksU0FBUyxDQUFDTSxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3BDcUksS0FBSyxDQUFDM0ksU0FBUyxDQUFDTSxNQUFNLENBQUMsUUFBUSxDQUFDO1VBQ3BDLENBQUMsQ0FBQztVQUNGa0ksZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRWQsTUFBTSxDQUFDO1FBRXpEO01BQ0osQ0FBQyxFQUFFLElBQUksQ0FBQztJQUNaO0lBRUFDLE9BQU8sQ0FBQ2hELGdCQUFnQixDQUFDLE9BQU8sRUFBRTtNQUFBLE9BQU1tRixXQUFXLENBQUMsTUFBTSxDQUFDO0lBQUEsRUFBQztJQUM1RGxDLFFBQVEsQ0FBQ2pELGdCQUFnQixDQUFDLE9BQU8sRUFBRTtNQUFBLE9BQU1tRixXQUFXLENBQUMsT0FBTyxDQUFDO0lBQUEsRUFBQztJQUU5RGpDLFdBQVcsQ0FBQ3JJLE9BQU8sQ0FBQyxVQUFDNkosSUFBSSxFQUFFM0gsQ0FBQyxFQUFLO01BQzdCMkgsSUFBSSxDQUFDMUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNRLENBQUMsRUFBSztRQUNsQyxJQUFHQSxDQUFDLENBQUNDLE1BQU0sQ0FBQ3BGLFNBQVMsQ0FBQ3NLLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUM1Q2hGLFVBQVUsQ0FBQyxZQUFNO1VBQ2J1QyxXQUFXLENBQUNySSxPQUFPLENBQUMsVUFBQStGLElBQUk7WUFBQSxPQUFJQSxJQUFJLENBQUN2RixTQUFTLENBQUNNLE1BQU0sQ0FBQyxVQUFVLENBQUM7VUFBQSxFQUFDO1FBQ2xFLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDUnVILFdBQVcsQ0FBQ3JJLE9BQU8sQ0FBQyxVQUFBNkosSUFBSSxFQUFHO1VBQ3ZCQSxJQUFJLENBQUNjLEtBQUssQ0FBQ0UsYUFBYSxHQUFHLE1BQU07UUFFckMsQ0FBQyxDQUFDO1FBQ0Z6QyxRQUFRLENBQUN1QyxLQUFLLENBQUNFLGFBQWEsR0FBRyxNQUFNO1FBQ3JDMUMsT0FBTyxDQUFDd0MsS0FBSyxDQUFDRSxhQUFhLEdBQUcsTUFBTTtRQUVwQzNDLE1BQU0sQ0FBQ0ksT0FBTyxDQUFDLENBQUM5SCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDdkM2SCxPQUFPLEdBQUdwRyxDQUFDO1FBQ1hnRyxNQUFNLENBQUNsSSxPQUFPLENBQUMsVUFBQW1KLEtBQUssRUFBRztVQUNuQixJQUFNb0IsUUFBUSxHQUFHcEIsS0FBSyxDQUFDN0ssYUFBYSxDQUFDLGlCQUFpQixDQUFDO1VBQ3ZELElBQU1rTSxTQUFTLEdBQUdyQixLQUFLLENBQUM3SyxhQUFhLENBQUMsaUJBQWlCLENBQUM7VUFDeEQsSUFBTW1NLFlBQVksR0FBR0YsUUFBUSxDQUFDak0sYUFBYSxDQUFDLFdBQVcsQ0FBQztVQUN4RCxJQUFNb00sYUFBYSxHQUFHRixTQUFTLENBQUNsTSxhQUFhLENBQUMsV0FBVyxDQUFDO1VBQzFEaU0sUUFBUSxDQUFDL0osU0FBUyxDQUFDQyxHQUFHLENBQUMsV0FBVyxDQUFDO1VBQ25DK0osU0FBUyxDQUFDaEssU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDO1VBQ3JDZ0ssWUFBWSxDQUFDRSxLQUFLLENBQUNDLFVBQVUsK0NBQXVDdEMsT0FBTyxHQUFHLENBQUMsa0NBQThCO1VBQzdHb0MsYUFBYSxDQUFDQyxLQUFLLENBQUNDLFVBQVUsZ0RBQXdDdEMsT0FBTyxHQUFHLENBQUMsa0NBQThCO1FBQ25ILENBQUMsQ0FBQztRQUNGeEMsVUFBVSxDQUFDLFlBQU07VUFDYjJELGNBQWMsQ0FBQ3BCLFdBQVcsRUFBRUMsT0FBTyxDQUFDO1VBQ3BDSixNQUFNLENBQUNsSSxPQUFPLENBQUMsVUFBQ21KLEtBQUssRUFBRTRCLEtBQUssRUFBSztZQUM3QjVCLEtBQUssQ0FBQzNJLFNBQVMsQ0FBQ3FHLE1BQU0sQ0FBQyxTQUFTLEVBQUVrRSxLQUFLLEtBQUt6QyxPQUFPLENBQUM7WUFDcEQsSUFBTWlDLFFBQVEsR0FBR3BCLEtBQUssQ0FBQzdLLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztZQUN2RCxJQUFNa00sU0FBUyxHQUFHckIsS0FBSyxDQUFDN0ssYUFBYSxDQUFDLGlCQUFpQixDQUFDO1lBQ3hEaU0sUUFBUSxDQUFDL0osU0FBUyxDQUFDTSxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ3RDMEosU0FBUyxDQUFDaEssU0FBUyxDQUFDTSxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3hDO1lBQ0E7VUFDSixDQUFDLENBQUM7O1VBQ0ZzSCxRQUFRLENBQUN1QyxLQUFLLENBQUNFLGFBQWEsR0FBRyxTQUFTO1VBQ3hDMUMsT0FBTyxDQUFDd0MsS0FBSyxDQUFDRSxhQUFhLEdBQUcsU0FBUztVQUN2Q3hDLFdBQVcsQ0FBQ3JJLE9BQU8sQ0FBQyxVQUFBNkosSUFBSSxFQUFHO1lBQ3ZCQSxJQUFJLENBQUNjLEtBQUssQ0FBQ0UsYUFBYSxHQUFHLFNBQVM7VUFFeEMsQ0FBQyxDQUFDO1VBQ0ZsRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1VBQ1hBLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFZixDQUFDLEVBQUUsSUFBSSxDQUFDO01BQ1osQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBQ0Y4RSxjQUFjLENBQUNwQixXQUFXLEVBQUVDLE9BQU8sQ0FBQztJQUNwQztFQUVKOztFQUVBTCxZQUFZLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLEVBQUUsc0JBQXNCLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztBQUVoSyxDQUFDLEdBQUciLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgUFJPTU9fRU5EX0RBVEUgPSBuZXcgRGF0ZSgnMjAyNC0xMC0yMlQxODozMDowMC4wMDBaJyk7IC8vLTMgaG91cnNcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX3NoYWtodGFyX3ByZWRpY3Rvcic7XG5cbiAgICBjb25zdFxuICAgICAgICByZXN1bHRzVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHktc2Nyb2xsJyksXG4gICAgICAgIHVuYXV0aE1zZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudW5hdXRoLW1zZycpLFxuICAgICAgICB5b3VBcmVJbkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9vay1wYXJ0JyksXG4gICAgICAgIHByZWRpY3Rpb25CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdF9fYnRuJyksXG4gICAgICAgIHlvdXJCZXRUeHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdF9feW91ckJldCcpO1xuXG4gICAgY29uc3QgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpO1xuICAgIGNvbnN0IGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIGxldCBsb2NhbGUgPSAndWsnO1xuXG4gICAgaWYgKHVrTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgbGV0IHVzZXJJZDtcbiAgICAvLyB1c2VySWQgPSAxMDAzMDAyNjhcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHthcGlVUkx9L3RyYW5zbGF0ZXMvJHtsb2NhbGV9YCkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICAgICAgICAgIGkxOG5EYXRhID0ganNvbjtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcblxuICAgICAgICAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoYWtodGFyJyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpXG4gICAgICAgIGlmIChlbGVtcyAmJiBlbGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsZW1zLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0cmFuc2xhdGVLZXkoa2V5KTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVmcmVzaExvY2FsaXplZENsYXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8ICcqLS0tLU5FRUQgVE8gQkUgVFJBTlNMQVRFRC0tLS0qICAga2V5OiAgJyArIGtleTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoTG9jYWxpemVkQ2xhc3MoZWxlbWVudCwgYmFzZUNzc0NsYXNzKSB7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBbJ3VrJywgJ2VuJ10pIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShiYXNlQ3NzQ2xhc3MgKyBsYW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYmFzZUNzc0NsYXNzICsgbG9jYWxlKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKGxpbmssIGV4dHJhT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VXNlcnMoKSB7XG4gICAgICAgIHJldHVybiByZXF1ZXN0KCcvdXNlcnMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgZ2V0VXNlcnMoKS50aGVuKHVzZXJzID0+IHtcbiAgICAgICAgICAgIHJlbmRlclVzZXJzKHVzZXJzKTtcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGluaXRTY29yZVNlbGVjdG9yKDEpO1xuICAgICAgICBpbml0U2NvcmVTZWxlY3RvcigyKTtcbiAgICAgICAgaW5pdFByZWRpY3Rpb25CdG4oKTtcblxuICAgICAgICBpZiAod2luZG93LnN0b3JlKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgICAgICBJbml0UGFnZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgICAgIGxldCBjID0gMDtcbiAgICAgICAgICAgIHZhciBpID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhd2luZG93LmdfdXNlcl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gd2luZG93LmdfdXNlcl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclVzZXJzKHVzZXJzKSB7XG4gICAgICAgIHBvcHVsYXRlVXNlcnNUYWJsZSh1c2VycywgdXNlcklkLCByZXN1bHRzVGFibGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvcHVsYXRlVXNlcnNUYWJsZSh1c2VycywgY3VycmVudFVzZXJJZCwgdGFibGUpIHtcbiAgICAgICAgdGFibGUuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICh1c2VycyAmJiB1c2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRVc2VyID0gdXNlcklkICYmIHVzZXJzLmZpbmQodXNlciA9PiB1c2VyLnVzZXJpZCA9PT0gY3VycmVudFVzZXJJZCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFVzZXIpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5VXNlcihjdXJyZW50VXNlciwgdHJ1ZSwgdGFibGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1c2Vycy5mb3JFYWNoKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHVzZXIudXNlcmlkICE9PSBjdXJyZW50VXNlcklkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlVc2VyKHVzZXIsIGZhbHNlLCB0YWJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwbGF5VXNlcih1c2VyLCBpc0N1cnJlbnRVc2VyLCB0YWJsZSkge1xuICAgICAgICBjb25zdCBhZGRpdGlvbmFsVXNlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhZGRpdGlvbmFsVXNlclJvdy5jbGFzc0xpc3QuYWRkKCd0YWJsZV9fcm93Jyk7XG4gICAgICAgIGlmIChpc0N1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgICB1cGRhdGVMYXN0UHJlZGljdGlvbih1c2VyKTtcbiAgICAgICAgICAgIGFkZGl0aW9uYWxVc2VyUm93LmNsYXNzTGlzdC5hZGQoJ3lvdScpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkaXRpb25hbFVzZXJSb3cuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlX19yb3ctaXRlbVwiPiR7aXNDdXJyZW50VXNlciA/IHVzZXIudXNlcmlkIDogbWFza1VzZXJJZCh1c2VyLnVzZXJpZCl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX3Jvdy1pdGVtXCI+JHtmb3JtYXREYXRlU3RyaW5nKHVzZXIubGFzdEZvcmVjYXN0KX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fcm93LWl0ZW1cIj4ke3VzZXIudGVhbTF9OiR7dXNlci50ZWFtMn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fcm93LWl0ZW1cIj4qKioqKioqKioqKioqKjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICB0YWJsZS5hcHBlbmQoYWRkaXRpb25hbFVzZXJSb3cpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxhc3RQcmVkaWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdGVhbTFMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY29yZVRlYW0xJyk7XG4gICAgICAgIGNvbnN0IHRlYW0yTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NvcmVUZWFtMicpO1xuICAgICAgICB0ZWFtMUxhYmVsLmlubmVySFRNTCA9IGRhdGEudGVhbTE7XG4gICAgICAgIHRlYW0yTGFiZWwuaW5uZXJIVE1MID0gZGF0YS50ZWFtMlxuXG4gICAgICAgIC8vIGNvbnN0IHRydWVCZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdF9fYmV0LXRydWUnKTtcbiAgICAgICAgLy8gY29uc3QgZmFsc2VCZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdF9fYmV0LWZhbHNlJyk7XG4gICAgICAgIC8vIGlmICh1c2VyLmJldENvbmZpcm1lZCkge1xuICAgICAgICAvLyAgICAgdHJ1ZUJldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIC8vICAgICBmYWxzZUJldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICB0cnVlQmV0LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgLy8gICAgIGZhbHNlQmV0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdERhdGVTdHJpbmcoZGF0ZVN0cmluZykge1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cmluZyk7XG5cbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICBjb25zdCBtb250aCA9IChkYXRlLmdldE1vbnRoKCkgKyAxKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgY29uc3QgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcblxuICAgICAgICByZXR1cm4gYCR7ZGF5fS4ke21vbnRofS4ke3llYXJ9IC8gJHtob3Vyc306JHttaW51dGVzfWA7XG4gICAgfVxuXG4gICAgLy8gZnVuY3Rpb24gbWFza1VzZXJJZCh1c2VySWQpIHtcbiAgICAvLyAgICAgcmV0dXJuIFwiKipcIiArIHVzZXJJZC50b1N0cmluZygpLnNsaWNlKDIpO1xuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIGxldCBjaGVja1VzZXJBdXRoID0gKCkgPT4ge1xuICAgIC8vICAgICBpZiAodXNlcklkKSB7XG4gICAgLy8gICAgICAgICB1bmF1dGhNc2dzLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSk7XG4gICAgLy8gICAgICAgICB5b3VBcmVJbkJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIGNvbnN0IHNjb3JlUHJlZGljdGlvbiA9IFtcbiAgICAgICAge3RlYW0xIDogMCwgdGVhbTI6IDB9LFxuICAgICAgICB7dGVhbTEgOiAwLCB0ZWFtMjogMH0sXG4gICAgICAgIHt0ZWFtMSA6IDAsIHRlYW0yOiAwfSxcbiAgICAgICAge3RlYW0xIDogMCwgdGVhbTI6IDB9LFxuICAgICAgICB7dGVhbTEgOiAwLCB0ZWFtMjogMH0sXG4gICAgXVxuXG4gICAgZnVuY3Rpb24gc2V0U2NvcmUodGVhbU51bWJlcil7XG4gICAgICAgIGNvbnN0IHNjb3JlUGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnByZWRpY3Rpb25UZWFtJHt0ZWFtTnVtYmVyfWApO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkVGFnID0gYHRlYW0ke3RlYW1OdW1iZXJ9YDtcblxuICAgICAgICBzY29yZVBhbmVscy5mb3JFYWNoKChwYW5lbCwgaSkgPT57XG4gICAgICAgICAgICBwYW5lbC5pbm5lckhUTUwgPSBzY29yZVByZWRpY3Rpb25baV1bZmllbGRUYWddO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRTY29yZVNlbGVjdG9yKHRlYW1OdW1iZXIpIHtcbiAgICAgICAgY29uc3QgbWludXNCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnRlYW0ke3RlYW1OdW1iZXJ9LW1pbnVzYCk7XG4gICAgICAgIGNvbnN0IHBsdXNCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnRlYW0ke3RlYW1OdW1iZXJ9LXBsdXNgKTtcbiAgICAgICAgY29uc3Qgc2NvcmVQYW5lbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucHJlZGljdGlvblRlYW0ke3RlYW1OdW1iZXJ9YCk7XG5cbiAgICAgICAgY29uc3QgZmllbGRUYWcgPSBgdGVhbSR7dGVhbU51bWJlcn1gO1xuXG4gICAgICAgIHNjb3JlUGFuZWxzLmZvckVhY2goKHBhbmVsLCBpKSA9PntcbiAgICAgICAgICAgIHBhbmVsLmlubmVySFRNTCA9IHNjb3JlUHJlZGljdGlvbltpXVtmaWVsZFRhZ107XG4gICAgICAgIH0pXG5cblxuICAgICAgICBtaW51c0J0bnMuZm9yRWFjaCgoYnRuLCBpKSA9PiB7XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2NvcmUgPSBzY29yZVByZWRpY3Rpb25baV1bZmllbGRUYWddO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjb3JlUHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICBzY29yZVByZWRpY3Rpb25baV1bZmllbGRUYWddID0gTWF0aC5tYXgoY3VycmVudFNjb3JlIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgc2NvcmVQYW5lbHMuZm9yRWFjaChwYW5lbCA9PntcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuaW5uZXJIVE1MID0gc2NvcmVQcmVkaWN0aW9uW2ldW2ZpZWxkVGFnXTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcblxuXG4gICAgICAgIHBsdXNCdG5zLmZvckVhY2goKGJ0biwgaSkgPT57XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgZmllbGRUYWcgPSBgdGVhbSR7dGVhbU51bWJlcn1gO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTY29yZSA9IHNjb3JlUHJlZGljdGlvbltpXVtmaWVsZFRhZ107XG4gICAgICAgICAgICAgICAgc2NvcmVQcmVkaWN0aW9uW2ldW2ZpZWxkVGFnXSA9IE1hdGgubWluKGN1cnJlbnRTY29yZSArIDEsIDk5KTtcbiAgICAgICAgICAgICAgICBzY29yZVBhbmVscy5mb3JFYWNoKHBhbmVsID0+e1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5pbm5lckhUTUwgPSBzY29yZVByZWRpY3Rpb25baV1bZmllbGRUYWddO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGxldCBpc1JlcXVlc3RJblByb2dyZXNzO1xuICAgIGZ1bmN0aW9uIGluaXRQcmVkaWN0aW9uQnRuKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoISFlLnRhcmdldC5jbG9zZXN0KCcucHJlZGljdF9fYnRuJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNSZXF1ZXN0SW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeW91ckJldFR4dC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB5b3VBcmVJbkJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2hvd0J0bicpKTtcbiAgICAgICAgICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgICAgICAgICB5b3VBcmVJbkJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZCgnc2hvd0J0bicpKTtcbiAgICAgICAgICAgICAgICBpc1JlcXVlc3RJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwcmVkaWN0aW9uQnRuLmNsYXNzTGlzdC5hZGQoXCJwb2ludGVyLW5vbmVcIik7XG4gICAgICAgICAgICAgICAgcmVxdWVzdCgnL2JldCcsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJpZDogdXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbTE6IHNjb3JlUHJlZGljdGlvbi50ZWFtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW0yOiBzY29yZVByZWRpY3Rpb24udGVhbTJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlzUmVxdWVzdEluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbkJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwicG9pbnRlci1ub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICBJbml0UGFnZSgpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpc1JlcXVlc3RJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25CdG4uY2xhc3NMaXN0LnJlbW92ZShcInBvaW50ZXItbm9uZVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBsb2FkVHJhbnNsYXRpb25zKClcbiAgICAgICAgLnRoZW4oaW5pdCk7XG5cbiAgICBsZXQgbWFpblBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmF2LXBhZ2UnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93JyksIDEwMDApO1xuXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGlmKGN1cnJlbnREYXRlID49IFBST01PX0VORF9EQVRFKSB7XG4gICAgICAgIHlvdUFyZUluQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKCdibG9jay1idG4nKSk7XG4gICAgfVxuXG4gICAgLy8gcG9wdXBzXG4gICAgZnVuY3Rpb24gc2V0UG9wdXBzKHBvcHVwcywgY2xvc2VCdG5zLCBzaG93QnRucyl7XG4gICAgICAgIHBvcHVwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cG9wdXBzfWApXG4gICAgICAgIGNsb3NlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7Y2xvc2VCdG5zfWApXG4gICAgICAgIHNob3dCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtzaG93QnRuc31gKVxuXG4gICAgICAgIHNob3dCdG5zLmZvckVhY2goKHNob3dCdG4sIHNob3dCdG5JbmRleCkgPT4ge1xuICAgICAgICAgICAgc2hvd0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgICAgICAgICAgcG9wdXBzLmZvckVhY2goKHBvcHVwLCBwb3B1cEluZGV4KSA9PntcbiAgICAgICAgICAgICAgICAgICAgaWYocG9wdXBJbmRleCA9PT0gc2hvd0J0bkluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgY2xvc2VCdG5zLmZvckVhY2goKHNob3dCdG4sIGNsb3NlQnRuSW5kZXgpID0+IHtcbiAgICAgICAgICAgIHNob3dCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICAgICAgICAgIHBvcHVwcy5mb3JFYWNoKChwb3B1cCwgcG9wdXBJbmRleCkgPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwSW5kZXggPT09IGNsb3NlQnRuSW5kZXgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBzZXRQb3B1cHMoXCIuZ3VpZGVfX2xpc3QtcG9wdXBcIiwgXCIuZ3VpZGVfX2xpc3QtcG9wdXAtY2xvc2VcIiwgXCIuZ3VpZGVfX2xpc3QtYnRuXCIpXG5cbiAgICAvLyBzY3JvbGwgYWRkIGFuaW1cblxuICAgIGNvbnN0IHRhYmxlTGlnaHRuaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlJyk7XG4gICAgY29uc3QgdGFibGVDdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2N1cCcpO1xuICAgIGNvbnN0IHRhYmxlUGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fcGVycycpO1xuICAgIGNvbnN0IHByaXplTGlnaHRuaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByaXplJyk7XG4gICAgY29uc3QgcHJvbW9UaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tb19fdGl0bGUnKTtcblxuICAgIGZ1bmN0aW9uIGFuaW1hdGVPblNjcm9sbChlbGVtZW50LCBhbmltYXRpb25DbGFzcykge1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgcm9vdDogbnVsbCxcbiAgICAgICAgICAgIHJvb3RNYXJnaW46ICcwcHgnLFxuICAgICAgICAgICAgdGhyZXNob2xkOiAwLjJcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGFuaW1hdGlvbkNsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcbiAgICB9XG4gICAgYW5pbWF0ZU9uU2Nyb2xsKHRhYmxlTGlnaHRuaW5nLCBcInRhYmxlTGlnaHRuaW5nXCIpXG4gICAgYW5pbWF0ZU9uU2Nyb2xsKHRhYmxlQ3VwLCBcImZhZGVJbkxlZnRcIilcbiAgICBhbmltYXRlT25TY3JvbGwodGFibGVQZXJzLCBcImZhZGVJblJpZ2h0XCIpXG4gICAgYW5pbWF0ZU9uU2Nyb2xsKHByaXplTGlnaHRuaW5nLCBcInByaXplTGlnaHRuaW5nXCIpXG5cbiAgICBjb25zdCB0aXRsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRpdGxlXCIpXG5cbiAgICB0aXRsZXMuZm9yRWFjaCh0aXRsZSA9PntcbiAgICAgICAgYW5pbWF0ZU9uU2Nyb2xsKHRpdGxlLCBcImZhZGVJblwiKVxuICAgIH0pXG5cblxuXG4gICAgLy8vINCz0LvRltGHINGB0LvQsNC50LTQtdGAXG4gICAgZnVuY3Rpb24gY3JlYXRlU2xpZGVyKHNsaWRlcywgbGVmdEJ0biwgcmlnaHRCdG4sIHNsaWRlc0ljb25zLCBjdXJyZW50LCBwYXRoLCBpbWcsIHdlZWssIGNvdmVyZmxvdywgY292ZXJmbG93T2ZmV2lkdGgsIHN1YnRpdGxlcywgY29weVNsaWRlcyl7XG4gICAgICAgIGxldCBjb3ZlcmZsb3dUb2dnbGVyID0gdHJ1ZVxuICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA8IGNvdmVyZmxvd09mZldpZHRoKXtcbiAgICAgICAgICAgIGNvdmVyZmxvd1RvZ2dsZXIgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvdmVyRmxvd0NsYXNzZXMocmlnaHQsIGxlZnQsIHNsaWRlcykge1xuICAgICAgICAgICAgc2xpZGVzLmZvckVhY2goKHNsaWRlLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdmVyZmxvd1RvZ2dsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2SW5kZXggPSAoaSAtIDEgKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNbcHJldkluZGV4XS5jbGFzc0xpc3QuYWRkKHJpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSAoaSArIDEpICUgc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1tuZXh0SW5kZXhdLmNsYXNzTGlzdC5hZGQobGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2xpZGVzKTtcbiAgICAgICAgc3VidGl0bGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzdWJ0aXRsZXMpO1xuICAgICAgICBsZWZ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihsZWZ0QnRuKTtcbiAgICAgICAgcmlnaHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHJpZ2h0QnRuKTtcbiAgICAgICAgc2xpZGVzSWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNsaWRlc0ljb25zKTtcbiAgICAgICAgbGV0IGdsaXRjaExheWVycyA9IFtdO1xuICAgICAgICBzbGlkZXMuZm9yRWFjaChzbGlkZSA9PiB7XG4gICAgICAgICAgICBnbGl0Y2hMYXllcnMgPSBbLi4uZ2xpdGNoTGF5ZXJzLCAuLi5zbGlkZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmdsaXRjaF9fbGF5ZXJcIildO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYoc2xpZGVzW2N1cnJlbnRdKXNsaWRlc1tjdXJyZW50XS5jbGFzc0xpc3QuYWRkKFwiX2FjdGl2ZVwiKTtcbiAgICAgICAgaWYoY292ZXJmbG93KXtcbiAgICAgICAgICAgIGNvdmVyRmxvd0NsYXNzZXMoXCJyaWdodC1jb3ZlclwiLCBcImxlZnQtY292ZXJcIiwgc2xpZGVzKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZnVuY3Rpb24gc3VidGl0bGVzSW5pdChzdWJ0aXRsZXMsIHNsaWRlcyl7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhzbGlkZXMpXG4gICAgICAgIC8vICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIHNsaWRlSW5kZXgpID0+e1xuICAgICAgICAvLyAgICAgICAgIGlmKHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyhcIl9hY3RpdmVcIikpe1xuICAgICAgICAvLyAgICAgICAgICAgICBzdWJ0aXRsZXMuZm9yRWFjaCgoc3VidGl0bGUsIHN1YnRpdGxlSW5kZXgpID0+e1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3VidGl0bGUuY2xhc3NMaXN0LnJlbW92ZShcIl9hY3RpdmVcIilcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKHNsaWRlSW5kZXggPT09IHN1YnRpdGxlSW5kZXgpe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHN1YnRpdGxlLmNsYXNzTGlzdC5hZGQoXCJfYWN0aXZlXCIpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgIH0pXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gfVxuICAgICAgICBmdW5jdGlvbiBtb3ZlU2xpZGVyKHNsaWRlcywgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgIC0tY3VycmVudDtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA8IDApIGN1cnJlbnQgPSBzbGlkZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICArK2N1cnJlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBzbGlkZXMubGVuZ3RoIC0gMSkgY3VycmVudCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC50b2dnbGUoXCJfYWN0aXZlXCIsIGkgPT09IGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgIHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJlZGljdF9fdGVhbTFcIikuY2xhc3NMaXN0LnJlbW92ZShcImxlZnQtYW5pbVwiKTtcbiAgICAgICAgICAgICAgICBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLnByZWRpY3RfX3RlYW0yXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJyaWdodC1hbmltXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFNsaWRlSWNvbnNJbml0KHNsaWRlc0ljb25zLCBjdXJyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIFNsaWRlSWNvbnNJbml0KGljb25zLCBjdXJyZW50KSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyID0gaWNvbnNbMF0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cod3JhcHBlcilcblxuICAgICAgICAgICAgaWNvbnMuZm9yRWFjaCgoaWNvbiwgaWNvbkluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWNvbi5jbGFzc0xpc3QudG9nZ2xlKFwiX2N1cnJlbnRcIiwgY3VycmVudCA9PT0gaWNvbkluZGV4KTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA9PT0gaWNvbkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGljb25PZmZzZXRMZWZ0ID0gaWNvbi5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpY29uV2lkdGggPSBpY29uLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3cmFwcGVyV2lkdGggPSB3cmFwcGVyLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGljb25PZmZzZXRMZWZ0IC0gKHdyYXBwZXJXaWR0aCAvIDIpICsgKGljb25XaWR0aCAvIDIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBzbGlkZXMuZm9yRWFjaChzbGlkZSA9PntcbiAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Q2FyZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJlZGljdF9fdGVhbTFcIilcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodENhcmQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLnByZWRpY3RfX3RlYW0yXCIpXG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdENhcmRCYWNrID0gbGVmdENhcmQucXVlcnlTZWxlY3RvcihcIi5iYWNrLWltZ1wiKVxuICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q2FyZEJhY2sgPSByaWdodENhcmQucXVlcnlTZWxlY3RvcihcIi5iYWNrLWltZ1wiKVxuICAgICAgICAgICAgICAgIGxlZnRDYXJkLmNsYXNzTGlzdC5hZGQoXCJsZWZ0LWFuaW1cIik7XG4gICAgICAgICAgICAgICAgcmlnaHRDYXJkLmNsYXNzTGlzdC5hZGQoXCJyaWdodC1hbmltXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBjdXJyZW50IC0gMSwgc2xpZGVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50ICsgMSA8IHNsaWRlcy5sZW5ndGggJiYgZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0Q2FyZEJhY2suc3R5bGUuYmFja2dyb3VuZCA9IGB1cmwoXCIuL2ltZy9wcmVkaWN0L2xlZnQtdGVhbS1kZXNjJHtjdXJyZW50ICsgMn0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4vaW1nL3ByZWRpY3QvcmlnaHQtdGVhbS1kZXNjJHtjdXJyZW50ICsgMn0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChjdXJyZW50ICsgMSA9PT0gc2xpZGVzLmxlbmd0aCAmJiBkaXJlY3Rpb24gPT09IFwicmlnaHRcIil7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4vaW1nL3ByZWRpY3QvbGVmdC10ZWFtLWRlc2MxLnBuZ1wiKSBuby1yZXBlYXQgMCAwL2NvbnRhaW5gXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0Q2FyZEJhY2suc3R5bGUuYmFja2dyb3VuZCA9IGB1cmwoXCIuL2ltZy9wcmVkaWN0L3JpZ2h0LXRlYW0tZGVzYzEucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudCAtIDEgPiAxICYmIGRpcmVjdGlvbiA9PT0gXCJsZWZ0XCIpe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0Q2FyZEJhY2suc3R5bGUuYmFja2dyb3VuZCA9IGB1cmwoXCIuL2ltZy9wcmVkaWN0L2xlZnQtdGVhbS1kZXNjJHtjdXJyZW50IH0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4vaW1nL3ByZWRpY3QvcmlnaHQtdGVhbS1kZXNjJHtjdXJyZW50IH0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChjdXJyZW50IC0gMSA9PT0gMCAmJiBkaXJlY3Rpb24gPT09IFwibGVmdFwiKXtcbiAgICAgICAgICAgICAgICAgICAgbGVmdENhcmRCYWNrLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiLi9pbWcvcHJlZGljdC9sZWZ0LXRlYW0tZGVzYyR7c2xpZGVzLmxlbmd0aH0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4vaW1nL3ByZWRpY3QvcmlnaHQtdGVhbS1kZXNjJHtzbGlkZXMubGVuZ3RofS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGxlZnRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbW92ZVNsaWRlcihzbGlkZXMsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgcmlnaHRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiaW5pdGlhbFwiO1xuICAgICAgICAgICAgICAgIGxlZnRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiaW5pdGlhbFwiO1xuICAgICAgICAgICAgICAgIHNldFNjb3JlKDEpXG4gICAgICAgICAgICAgICAgc2V0U2NvcmUoMilcbiAgICAgICAgICAgICAgICAvLyBpbml0U2NvcmVTZWxlY3RvcigxKTtcbiAgICAgICAgICAgICAgICAvLyBpbml0U2NvcmVTZWxlY3RvcigyKTtcbiAgICAgICAgICAgICAgICBpZihjb3ZlcmZsb3cpe1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXMuZm9yRWFjaChzbGlkZSA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJyaWdodC1jb3ZlclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImxlZnQtY292ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJnbGl0Y2hcIilcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgY292ZXJGbG93Q2xhc3NlcyhcInJpZ2h0LWNvdmVyXCIsIFwibGVmdC1jb3ZlclwiLCBzbGlkZXMpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxlZnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGhhbmRsZUNsaWNrKFwibGVmdFwiKSk7XG4gICAgICAgIHJpZ2h0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBoYW5kbGVDbGljayhcInJpZ2h0XCIpKTtcblxuICAgICAgICBzbGlkZXNJY29ucy5mb3JFYWNoKChpY29uLCBpKSA9PiB7XG4gICAgICAgICAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIl9jdXJyZW50XCIpKSByZXR1cm5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzSWNvbnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcIl9jdXJyZW50XCIpKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICBzbGlkZXNJY29ucy5mb3JFYWNoKGljb24gPT57XG4gICAgICAgICAgICAgICAgICAgIGljb24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiXG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICBsZWZ0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcblxuICAgICAgICAgICAgICAgIHNsaWRlc1tjdXJyZW50XS5jbGFzc0xpc3QuYWRkKFwiZ2xpdGNoXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBpO1xuICAgICAgICAgICAgICAgIHNsaWRlcy5mb3JFYWNoKHNsaWRlID0+e1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Q2FyZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJlZGljdF9fdGVhbTFcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmlnaHRDYXJkID0gc2xpZGUucXVlcnlTZWxlY3RvcihcIi5wcmVkaWN0X190ZWFtMlwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Q2FyZEJhY2sgPSBsZWZ0Q2FyZC5xdWVyeVNlbGVjdG9yKFwiLmJhY2staW1nXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q2FyZEJhY2sgPSByaWdodENhcmQucXVlcnlTZWxlY3RvcihcIi5iYWNrLWltZ1wiKVxuICAgICAgICAgICAgICAgICAgICBsZWZ0Q2FyZC5jbGFzc0xpc3QuYWRkKFwibGVmdC1hbmltXCIpO1xuICAgICAgICAgICAgICAgICAgICByaWdodENhcmQuY2xhc3NMaXN0LmFkZChcInJpZ2h0LWFuaW1cIik7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4vaW1nL3ByZWRpY3QvbGVmdC10ZWFtLWRlc2Mke2N1cnJlbnQgKyAxfS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgICAgICByaWdodENhcmRCYWNrLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiLi9pbWcvcHJlZGljdC9yaWdodC10ZWFtLWRlc2Mke2N1cnJlbnQgKyAxfS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFNsaWRlSWNvbnNJbml0KHNsaWRlc0ljb25zLCBjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzLmZvckVhY2goKHNsaWRlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnRvZ2dsZShcIl9hY3RpdmVcIiwgaW5kZXggPT09IGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdENhcmQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLnByZWRpY3RfX3RlYW0xXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodENhcmQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLnByZWRpY3RfX3RlYW0yXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwibGVmdC1hbmltXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRDYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJyaWdodC1hbmltXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImdsaXRjaFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN1YnRpdGxlc0luaXQoc3VidGl0bGVzLCBzbGlkZXMpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByaWdodEJ0bi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiaW5pdGlhbFwiO1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXNJY29ucy5mb3JFYWNoKGljb24gPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImluaXRpYWxcIlxuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHNldFNjb3JlKDEpXG4gICAgICAgICAgICAgICAgICAgIHNldFNjb3JlKDIpXG5cbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgU2xpZGVJY29uc0luaXQoc2xpZGVzSWNvbnMsIGN1cnJlbnQpO1xuICAgICAgICAvLyBzdWJ0aXRsZXNJbml0KHN1YnRpdGxlcywgc2xpZGVzKVxuXG4gICAgfVxuXG4gICAgY3JlYXRlU2xpZGVyKFwiLnByZWRpY3RfX2NvdW50ZXJcIiwgXCIucHJlZGljdF9fbW92ZS1sZWZ0XCIsIFwiLnByZWRpY3RfX21vdmUtcmlnaHRcIiwgXCIucHJlZGljdF9faWNvbnMtaXRlbVwiLCAxLCBudWxsLCBcInBlcnMucG5nXCIsIG51bGwsIGZhbHNlLCBudWxsLCBudWxsLCB0cnVlKVxuXG59KSgpO1xuIl19
