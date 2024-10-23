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
  function maskUserId(userId) {
    return "**" + userId.toString().slice(2);
  }
  var checkUserAuth = function checkUserAuth() {
    if (userId) {
      unauthMsgs.forEach(function (item) {
        return item.classList.add('hide');
      });
      youAreInBtns.forEach(function (item) {
        return item.classList.remove('hide');
      });
    }
  };
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
          leftCardBack.style.background = "url(\"../img/predict/left-team-desc".concat(current + 2, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"../img/predict/right-team-desc".concat(current + 2, ".png\") no-repeat 0 0/contain");
        } else if (current + 1 === slides.length && direction === "right") {
          leftCardBack.style.background = "url(\"../img/predict/left-team-desc1.png\") no-repeat 0 0/contain";
          rightCardBack.style.background = "url(\"../img/predict/right-team-desc1.png\") no-repeat 0 0/contain";
        }
        if (current - 1 > 1 && direction === "left") {
          leftCardBack.style.background = "url(\"../img/predict/left-team-desc".concat(current, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"../img/predict/right-team-desc".concat(current, ".png\") no-repeat 0 0/contain");
        } else if (current - 1 === 0 && direction === "left") {
          leftCardBack.style.background = "url(\"../img/predict/left-team-desc".concat(slides.length, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"../img/predict/right-team-desc".concat(slides.length, ".png\") no-repeat 0 0/contain");
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
          leftCardBack.style.background = "url(\"../img/predict/left-team-desc".concat(current + 1, ".png\") no-repeat 0 0/contain");
          rightCardBack.style.background = "url(\"../img/predict/right-team-desc".concat(current + 1, ".png\") no-repeat 0 0/contain");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiUFJPTU9fRU5EX0RBVEUiLCJEYXRlIiwiYXBpVVJMIiwicmVzdWx0c1RhYmxlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwidW5hdXRoTXNncyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ5b3VBcmVJbkJ0bnMiLCJwcmVkaWN0aW9uQnRuIiwieW91ckJldFR4dCIsInVrTGVuZyIsImVuTGVuZyIsImxvY2FsZSIsImkxOG5EYXRhIiwidXNlcklkIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwibGFuZyIsInJlbW92ZSIsInJlcXVlc3QiLCJsaW5rIiwiZXh0cmFPcHRpb25zIiwiaGVhZGVycyIsImdldFVzZXJzIiwiSW5pdFBhZ2UiLCJ1c2VycyIsInJlbmRlclVzZXJzIiwiaW5pdCIsImluaXRTY29yZVNlbGVjdG9yIiwiaW5pdFByZWRpY3Rpb25CdG4iLCJ3aW5kb3ciLCJzdG9yZSIsInN0YXRlIiwiZ2V0U3RhdGUiLCJhdXRoIiwiaXNBdXRob3JpemVkIiwiaWQiLCJjIiwiaSIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJwb3B1bGF0ZVVzZXJzVGFibGUiLCJjdXJyZW50VXNlcklkIiwidGFibGUiLCJjdXJyZW50VXNlciIsImZpbmQiLCJ1c2VyIiwidXNlcmlkIiwiZGlzcGxheVVzZXIiLCJpc0N1cnJlbnRVc2VyIiwiYWRkaXRpb25hbFVzZXJSb3ciLCJjcmVhdGVFbGVtZW50IiwidXBkYXRlTGFzdFByZWRpY3Rpb24iLCJtYXNrVXNlcklkIiwiZm9ybWF0RGF0ZVN0cmluZyIsImxhc3RGb3JlY2FzdCIsInRlYW0xIiwidGVhbTIiLCJhcHBlbmQiLCJkYXRhIiwidGVhbTFMYWJlbCIsInRlYW0yTGFiZWwiLCJkYXRlU3RyaW5nIiwiZGF0ZSIsImRheSIsImdldERhdGUiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwibW9udGgiLCJnZXRNb250aCIsInllYXIiLCJnZXRGdWxsWWVhciIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsInNsaWNlIiwiaXRlbSIsInNjb3JlUHJlZGljdGlvbiIsInNldFNjb3JlIiwidGVhbU51bWJlciIsInNjb3JlUGFuZWxzIiwiZmllbGRUYWciLCJwYW5lbCIsIm1pbnVzQnRucyIsInBsdXNCdG5zIiwiYnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImN1cnJlbnRTY29yZSIsImNvbnNvbGUiLCJsb2ciLCJNYXRoIiwibWF4IiwibWluIiwiaXNSZXF1ZXN0SW5Qcm9ncmVzcyIsImUiLCJ0YXJnZXQiLCJjbG9zZXN0Iiwic2V0VGltZW91dCIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiY3VycmVudERhdGUiLCJzZXRQb3B1cHMiLCJwb3B1cHMiLCJjbG9zZUJ0bnMiLCJzaG93QnRucyIsInNob3dCdG4iLCJzaG93QnRuSW5kZXgiLCJwb3B1cCIsInBvcHVwSW5kZXgiLCJ0b2dnbGUiLCJjbG9zZUJ0bkluZGV4IiwidGFibGVMaWdodG5pbmciLCJ0YWJsZUN1cCIsInRhYmxlUGVycyIsInByaXplTGlnaHRuaW5nIiwicHJvbW9UaXRsZSIsImFuaW1hdGVPblNjcm9sbCIsImFuaW1hdGlvbkNsYXNzIiwib3B0aW9ucyIsInJvb3QiLCJyb290TWFyZ2luIiwidGhyZXNob2xkIiwib2JzZXJ2ZXIiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsImVudHJpZXMiLCJlbnRyeSIsImlzSW50ZXJzZWN0aW5nIiwidGl0bGVzIiwidGl0bGUiLCJjcmVhdGVTbGlkZXIiLCJzbGlkZXMiLCJsZWZ0QnRuIiwicmlnaHRCdG4iLCJzbGlkZXNJY29ucyIsImN1cnJlbnQiLCJwYXRoIiwiaW1nIiwid2VlayIsImNvdmVyZmxvdyIsImNvdmVyZmxvd09mZldpZHRoIiwic3VidGl0bGVzIiwiY29weVNsaWRlcyIsImNvdmVyZmxvd1RvZ2dsZXIiLCJpbm5lcldpZHRoIiwiY292ZXJGbG93Q2xhc3NlcyIsInJpZ2h0IiwibGVmdCIsInNsaWRlIiwicHJldkluZGV4IiwibmV4dEluZGV4IiwiZ2xpdGNoTGF5ZXJzIiwibW92ZVNsaWRlciIsImRpcmVjdGlvbiIsIlNsaWRlSWNvbnNJbml0IiwiaWNvbnMiLCJ3cmFwcGVyIiwicGFyZW50RWxlbWVudCIsImljb24iLCJpY29uSW5kZXgiLCJpY29uT2Zmc2V0TGVmdCIsIm9mZnNldExlZnQiLCJpY29uV2lkdGgiLCJvZmZzZXRXaWR0aCIsIndyYXBwZXJXaWR0aCIsInNjcm9sbFRvIiwiYmVoYXZpb3IiLCJoYW5kbGVDbGljayIsImxlZnRDYXJkIiwicmlnaHRDYXJkIiwibGVmdENhcmRCYWNrIiwicmlnaHRDYXJkQmFjayIsInN0eWxlIiwiYmFja2dyb3VuZCIsInBvaW50ZXJFdmVudHMiLCJjb250YWlucyIsImluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLENBQUMsWUFBWTtFQUNULElBQU1BLGNBQWMsR0FBRyxJQUFJQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0VBQzdELElBQU1DLE1BQU0sR0FBRyw2Q0FBNkM7RUFFNUQsSUFDSUMsWUFBWSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztJQUM1REMsVUFBVSxHQUFHRixRQUFRLENBQUNH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QVM7VUFDdkN4QyxXQUFXLENBQUN0SSxPQUFPLENBQUMsVUFBQThKLElBQUksRUFBRztZQUN2QkEsSUFBSSxDQUFDYyxLQUFLLENBQUNFLGFBQWEsR0FBRyxTQUFTO1VBRXhDLENBQUMsQ0FBQztVQUNGakcsUUFBUSxDQUFDLENBQUMsQ0FBQztVQUNYQSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRWYsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUNaLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUNGNkUsY0FBYyxDQUFDcEIsV0FBVyxFQUFFQyxPQUFPLENBQUM7SUFDcEM7RUFFSjs7RUFFQUwsWUFBWSxDQUFDLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLHNCQUFzQixFQUFFLHNCQUFzQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7QUFFaEssQ0FBQyxHQUFHIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IFBST01PX0VORF9EQVRFID0gbmV3IERhdGUoJzIwMjQtMTAtMjJUMTg6MzA6MDAuMDAwWicpOyAvLy0zIGhvdXJzXG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV9zaGFraHRhcl9wcmVkaWN0b3InO1xuXG4gICAgY29uc3RcbiAgICAgICAgcmVzdWx0c1RhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlX19ib2R5LXNjcm9sbCcpLFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnVuYXV0aC1tc2cnKSxcbiAgICAgICAgeW91QXJlSW5CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2stcGFydCcpLFxuICAgICAgICBwcmVkaWN0aW9uQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RfX2J0bicpLFxuICAgICAgICB5b3VyQmV0VHh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RfX3lvdXJCZXQnKTtcblxuICAgIGNvbnN0IHVrTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1a0xlbmcnKTtcbiAgICBjb25zdCBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyk7XG5cbiAgICBsZXQgbG9jYWxlID0gJ3VrJztcblxuICAgIGlmICh1a0xlbmcpIGxvY2FsZSA9ICd1ayc7XG4gICAgaWYgKGVuTGVuZykgbG9jYWxlID0gJ2VuJztcblxuICAgIGxldCBpMThuRGF0YSA9IHt9O1xuICAgIGxldCB1c2VySWQ7XG4gICAgLy8gdXNlcklkID0gMTAwMzAwMjY4XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS90cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGFraHRhcicpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKVxuICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdHJhbnNsYXRlS2V5KGtleSk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gJ2VuJykge1xuICAgICAgICAgICAgbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZUtleShrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTE4bkRhdGFba2V5XSB8fCAnKi0tLS1ORUVEIFRPIEJFIFRSQU5TTEFURUQtLS0tKiAgIGtleTogICcgKyBrZXk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaExvY2FsaXplZENsYXNzKGVsZW1lbnQsIGJhc2VDc3NDbGFzcykge1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGxhbmcgb2YgWyd1aycsICdlbiddKSB7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYmFzZUNzc0NsYXNzICsgbGFuZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGJhc2VDc3NDbGFzcyArIGxvY2FsZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IGZ1bmN0aW9uIChsaW5rLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGFwaVVSTCArIGxpbmssIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi4oZXh0cmFPcHRpb25zIHx8IHt9KVxuICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVzZXJzKCkge1xuICAgICAgICByZXR1cm4gcmVxdWVzdCgnL3VzZXJzJyk7XG4gICAgfVxuXG4gICAgY29uc3QgSW5pdFBhZ2UgPSAoKSA9PiB7XG4gICAgICAgIGdldFVzZXJzKCkudGhlbih1c2VycyA9PiB7XG4gICAgICAgICAgICByZW5kZXJVc2Vycyh1c2Vycyk7XG4gICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBpbml0U2NvcmVTZWxlY3RvcigxKTtcbiAgICAgICAgaW5pdFNjb3JlU2VsZWN0b3IoMik7XG4gICAgICAgIGluaXRQcmVkaWN0aW9uQnRuKCk7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gd2luZG93LnN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgICAgICB1c2VySWQgPSBzdGF0ZS5hdXRoLmlzQXV0aG9yaXplZCAmJiBzdGF0ZS5hdXRoLmlkIHx8ICcnO1xuICAgICAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBJbml0UGFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJVc2Vycyh1c2Vycykge1xuICAgICAgICBwb3B1bGF0ZVVzZXJzVGFibGUodXNlcnMsIHVzZXJJZCwgcmVzdWx0c1RhYmxlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZVVzZXJzVGFibGUodXNlcnMsIGN1cnJlbnRVc2VySWQsIHRhYmxlKSB7XG4gICAgICAgIHRhYmxlLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAodXNlcnMgJiYgdXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VXNlciA9IHVzZXJJZCAmJiB1c2Vycy5maW5kKHVzZXIgPT4gdXNlci51c2VyaWQgPT09IGN1cnJlbnRVc2VySWQpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheVVzZXIoY3VycmVudFVzZXIsIHRydWUsIHRhYmxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXNlcnMuZm9yRWFjaCgodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh1c2VyLnVzZXJpZCAhPT0gY3VycmVudFVzZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VXNlcih1c2VyLCBmYWxzZSwgdGFibGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzcGxheVVzZXIodXNlciwgaXNDdXJyZW50VXNlciwgdGFibGUpIHtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYWRkaXRpb25hbFVzZXJSb3cuY2xhc3NMaXN0LmFkZCgndGFibGVfX3JvdycpO1xuICAgICAgICBpZiAoaXNDdXJyZW50VXNlcikge1xuICAgICAgICAgICAgdXBkYXRlTGFzdFByZWRpY3Rpb24odXNlcik7XG4gICAgICAgICAgICBhZGRpdGlvbmFsVXNlclJvdy5jbGFzc0xpc3QuYWRkKCd5b3UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZGl0aW9uYWxVc2VyUm93LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fcm93LWl0ZW1cIj4ke2lzQ3VycmVudFVzZXIgPyB1c2VyLnVzZXJpZCA6IG1hc2tVc2VySWQodXNlci51c2VyaWQpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlX19yb3ctaXRlbVwiPiR7Zm9ybWF0RGF0ZVN0cmluZyh1c2VyLmxhc3RGb3JlY2FzdCl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX3Jvdy1pdGVtXCI+JHt1c2VyLnRlYW0xfToke3VzZXIudGVhbTJ9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX3Jvdy1pdGVtXCI+KioqKioqKioqKioqKio8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgdGFibGUuYXBwZW5kKGFkZGl0aW9uYWxVc2VyUm93KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMYXN0UHJlZGljdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IHRlYW0xTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NvcmVUZWFtMScpO1xuICAgICAgICBjb25zdCB0ZWFtMkxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjb3JlVGVhbTInKTtcbiAgICAgICAgdGVhbTFMYWJlbC5pbm5lckhUTUwgPSBkYXRhLnRlYW0xO1xuICAgICAgICB0ZWFtMkxhYmVsLmlubmVySFRNTCA9IGRhdGEudGVhbTJcblxuICAgICAgICAvLyBjb25zdCB0cnVlQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RfX2JldC10cnVlJyk7XG4gICAgICAgIC8vIGNvbnN0IGZhbHNlQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RfX2JldC1mYWxzZScpO1xuICAgICAgICAvLyBpZiAodXNlci5iZXRDb25maXJtZWQpIHtcbiAgICAgICAgLy8gICAgIHRydWVCZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAvLyAgICAgZmFsc2VCZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgdHJ1ZUJldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgIC8vICAgICBmYWxzZUJldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXREYXRlU3RyaW5nKGRhdGVTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcpO1xuXG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgY29uc3QgbW9udGggPSAoZGF0ZS5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG5cbiAgICAgICAgcmV0dXJuIGAke2RheX0uJHttb250aH0uJHt5ZWFyfSAvICR7aG91cnN9OiR7bWludXRlc31gO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hc2tVc2VySWQodXNlcklkKSB7XG4gICAgICAgIHJldHVybiBcIioqXCIgKyB1c2VySWQudG9TdHJpbmcoKS5zbGljZSgyKTtcbiAgICB9XG5cbiAgICBsZXQgY2hlY2tVc2VyQXV0aCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICAgICAgdW5hdXRoTXNncy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgeW91QXJlSW5CdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzY29yZVByZWRpY3Rpb24gPSBbXG4gICAgICAgIHt0ZWFtMSA6IDAsIHRlYW0yOiAwfSxcbiAgICAgICAge3RlYW0xIDogMCwgdGVhbTI6IDB9LFxuICAgICAgICB7dGVhbTEgOiAwLCB0ZWFtMjogMH0sXG4gICAgICAgIHt0ZWFtMSA6IDAsIHRlYW0yOiAwfSxcbiAgICAgICAge3RlYW0xIDogMCwgdGVhbTI6IDB9LFxuICAgIF1cblxuICAgIGZ1bmN0aW9uIHNldFNjb3JlKHRlYW1OdW1iZXIpe1xuICAgICAgICBjb25zdCBzY29yZVBhbmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wcmVkaWN0aW9uVGVhbSR7dGVhbU51bWJlcn1gKTtcblxuICAgICAgICBjb25zdCBmaWVsZFRhZyA9IGB0ZWFtJHt0ZWFtTnVtYmVyfWA7XG5cbiAgICAgICAgc2NvcmVQYW5lbHMuZm9yRWFjaCgocGFuZWwsIGkpID0+e1xuICAgICAgICAgICAgcGFuZWwuaW5uZXJIVE1MID0gc2NvcmVQcmVkaWN0aW9uW2ldW2ZpZWxkVGFnXTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0U2NvcmVTZWxlY3Rvcih0ZWFtTnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG1pbnVzQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC50ZWFtJHt0ZWFtTnVtYmVyfS1taW51c2ApO1xuICAgICAgICBjb25zdCBwbHVzQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC50ZWFtJHt0ZWFtTnVtYmVyfS1wbHVzYCk7XG4gICAgICAgIGNvbnN0IHNjb3JlUGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnByZWRpY3Rpb25UZWFtJHt0ZWFtTnVtYmVyfWApO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkVGFnID0gYHRlYW0ke3RlYW1OdW1iZXJ9YDtcblxuICAgICAgICBzY29yZVBhbmVscy5mb3JFYWNoKChwYW5lbCwgaSkgPT57XG4gICAgICAgICAgICBwYW5lbC5pbm5lckhUTUwgPSBzY29yZVByZWRpY3Rpb25baV1bZmllbGRUYWddO1xuICAgICAgICB9KVxuXG5cbiAgICAgICAgbWludXNCdG5zLmZvckVhY2goKGJ0biwgaSkgPT4ge1xuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNjb3JlID0gc2NvcmVQcmVkaWN0aW9uW2ldW2ZpZWxkVGFnXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzY29yZVByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgc2NvcmVQcmVkaWN0aW9uW2ldW2ZpZWxkVGFnXSA9IE1hdGgubWF4KGN1cnJlbnRTY29yZSAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHNjb3JlUGFuZWxzLmZvckVhY2gocGFuZWwgPT57XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLmlubmVySFRNTCA9IHNjb3JlUHJlZGljdGlvbltpXVtmaWVsZFRhZ107XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG5cblxuICAgICAgICBwbHVzQnRucy5mb3JFYWNoKChidG4sIGkpID0+e1xuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGZpZWxkVGFnID0gYHRlYW0ke3RlYW1OdW1iZXJ9YDtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2NvcmUgPSBzY29yZVByZWRpY3Rpb25baV1bZmllbGRUYWddO1xuICAgICAgICAgICAgICAgIHNjb3JlUHJlZGljdGlvbltpXVtmaWVsZFRhZ10gPSBNYXRoLm1pbihjdXJyZW50U2NvcmUgKyAxLCA5OSk7XG4gICAgICAgICAgICAgICAgc2NvcmVQYW5lbHMuZm9yRWFjaChwYW5lbCA9PntcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuaW5uZXJIVE1MID0gc2NvcmVQcmVkaWN0aW9uW2ldW2ZpZWxkVGFnXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBsZXQgaXNSZXF1ZXN0SW5Qcm9ncmVzcztcbiAgICBmdW5jdGlvbiBpbml0UHJlZGljdGlvbkJ0bigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCEhZS50YXJnZXQuY2xvc2VzdCgnLnByZWRpY3RfX2J0bicpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVxdWVzdEluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlvdXJCZXRUeHQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgeW91QXJlSW5CdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3dCdG4nKSk7XG4gICAgICAgICAgICAgICAgfSwgNTAwMCk7XG4gICAgICAgICAgICAgICAgeW91QXJlSW5CdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5hZGQoJ3Nob3dCdG4nKSk7XG4gICAgICAgICAgICAgICAgaXNSZXF1ZXN0SW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcHJlZGljdGlvbkJ0bi5jbGFzc0xpc3QuYWRkKFwicG9pbnRlci1ub25lXCIpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3QoJy9iZXQnLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW0xOiBzY29yZVByZWRpY3Rpb24udGVhbTEsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFtMjogc2NvcmVQcmVkaWN0aW9uLnRlYW0yXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpc1JlcXVlc3RJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25CdG4uY2xhc3NMaXN0LnJlbW92ZShcInBvaW50ZXItbm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXNSZXF1ZXN0SW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJwb2ludGVyLW5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgICAgIC50aGVuKGluaXQpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdi1wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICBpZihjdXJyZW50RGF0ZSA+PSBQUk9NT19FTkRfREFURSkge1xuICAgICAgICB5b3VBcmVJbkJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZCgnYmxvY2stYnRuJykpO1xuICAgIH1cblxuICAgIC8vIHBvcHVwc1xuICAgIGZ1bmN0aW9uIHNldFBvcHVwcyhwb3B1cHMsIGNsb3NlQnRucywgc2hvd0J0bnMpe1xuICAgICAgICBwb3B1cHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3BvcHVwc31gKVxuICAgICAgICBjbG9zZUJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke2Nsb3NlQnRuc31gKVxuICAgICAgICBzaG93QnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7c2hvd0J0bnN9YClcblxuICAgICAgICBzaG93QnRucy5mb3JFYWNoKChzaG93QnRuLCBzaG93QnRuSW5kZXgpID0+IHtcbiAgICAgICAgICAgIHNob3dCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICAgICAgICAgIHBvcHVwcy5mb3JFYWNoKChwb3B1cCwgcG9wdXBJbmRleCkgPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwSW5kZXggPT09IHNob3dCdG5JbmRleCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIGNsb3NlQnRucy5mb3JFYWNoKChzaG93QnRuLCBjbG9zZUJ0bkluZGV4KSA9PiB7XG4gICAgICAgICAgICBzaG93QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PntcbiAgICAgICAgICAgICAgICBwb3B1cHMuZm9yRWFjaCgocG9wdXAsIHBvcHVwSW5kZXgpID0+e1xuICAgICAgICAgICAgICAgICAgICBpZihwb3B1cEluZGV4ID09PSBjbG9zZUJ0bkluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgc2V0UG9wdXBzKFwiLmd1aWRlX19saXN0LXBvcHVwXCIsIFwiLmd1aWRlX19saXN0LXBvcHVwLWNsb3NlXCIsIFwiLmd1aWRlX19saXN0LWJ0blwiKVxuXG4gICAgLy8gc2Nyb2xsIGFkZCBhbmltXG5cbiAgICBjb25zdCB0YWJsZUxpZ2h0bmluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZScpO1xuICAgIGNvbnN0IHRhYmxlQ3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlX19jdXAnKTtcbiAgICBjb25zdCB0YWJsZVBlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVfX3BlcnMnKTtcbiAgICBjb25zdCBwcml6ZUxpZ2h0bmluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcml6ZScpO1xuICAgIGNvbnN0IHByb21vVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvbW9fX3RpdGxlJyk7XG5cbiAgICBmdW5jdGlvbiBhbmltYXRlT25TY3JvbGwoZWxlbWVudCwgYW5pbWF0aW9uQ2xhc3MpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHJvb3Q6IG51bGwsXG4gICAgICAgICAgICByb290TWFyZ2luOiAnMHB4JyxcbiAgICAgICAgICAgIHRocmVzaG9sZDogMC4yXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgICAgICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5jbGFzc0xpc3QuYWRkKGFuaW1hdGlvbkNsYXNzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb25DbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgfVxuICAgIGFuaW1hdGVPblNjcm9sbCh0YWJsZUxpZ2h0bmluZywgXCJ0YWJsZUxpZ2h0bmluZ1wiKVxuICAgIGFuaW1hdGVPblNjcm9sbCh0YWJsZUN1cCwgXCJmYWRlSW5MZWZ0XCIpXG4gICAgYW5pbWF0ZU9uU2Nyb2xsKHRhYmxlUGVycywgXCJmYWRlSW5SaWdodFwiKVxuICAgIGFuaW1hdGVPblNjcm9sbChwcml6ZUxpZ2h0bmluZywgXCJwcml6ZUxpZ2h0bmluZ1wiKVxuXG4gICAgY29uc3QgdGl0bGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50aXRsZVwiKVxuXG4gICAgdGl0bGVzLmZvckVhY2godGl0bGUgPT57XG4gICAgICAgIGFuaW1hdGVPblNjcm9sbCh0aXRsZSwgXCJmYWRlSW5cIilcbiAgICB9KVxuXG5cblxuICAgIC8vLyDQs9C70ZbRhyDRgdC70LDQudC00LXRgFxuICAgIGZ1bmN0aW9uIGNyZWF0ZVNsaWRlcihzbGlkZXMsIGxlZnRCdG4sIHJpZ2h0QnRuLCBzbGlkZXNJY29ucywgY3VycmVudCwgcGF0aCwgaW1nLCB3ZWVrLCBjb3ZlcmZsb3csIGNvdmVyZmxvd09mZldpZHRoLCBzdWJ0aXRsZXMsIGNvcHlTbGlkZXMpe1xuICAgICAgICBsZXQgY292ZXJmbG93VG9nZ2xlciA9IHRydWVcbiAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggPCBjb3ZlcmZsb3dPZmZXaWR0aCl7XG4gICAgICAgICAgICBjb3ZlcmZsb3dUb2dnbGVyID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3ZlckZsb3dDbGFzc2VzKHJpZ2h0LCBsZWZ0LCBzbGlkZXMpIHtcbiAgICAgICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb3ZlcmZsb3dUb2dnbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJldkluZGV4ID0gKGkgLSAxICsgc2xpZGVzLmxlbmd0aCkgJSBzbGlkZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzW3ByZXZJbmRleF0uY2xhc3NMaXN0LmFkZChyaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gKGkgKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNbbmV4dEluZGV4XS5jbGFzc0xpc3QuYWRkKGxlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNsaWRlcyk7XG4gICAgICAgIHN1YnRpdGxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3VidGl0bGVzKTtcbiAgICAgICAgbGVmdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobGVmdEJ0bik7XG4gICAgICAgIHJpZ2h0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihyaWdodEJ0bik7XG4gICAgICAgIHNsaWRlc0ljb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzbGlkZXNJY29ucyk7XG4gICAgICAgIGxldCBnbGl0Y2hMYXllcnMgPSBbXTtcbiAgICAgICAgc2xpZGVzLmZvckVhY2goc2xpZGUgPT4ge1xuICAgICAgICAgICAgZ2xpdGNoTGF5ZXJzID0gWy4uLmdsaXRjaExheWVycywgLi4uc2xpZGUucXVlcnlTZWxlY3RvckFsbChcIi5nbGl0Y2hfX2xheWVyXCIpXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmKHNsaWRlc1tjdXJyZW50XSlzbGlkZXNbY3VycmVudF0uY2xhc3NMaXN0LmFkZChcIl9hY3RpdmVcIik7XG4gICAgICAgIGlmKGNvdmVyZmxvdyl7XG4gICAgICAgICAgICBjb3ZlckZsb3dDbGFzc2VzKFwicmlnaHQtY292ZXJcIiwgXCJsZWZ0LWNvdmVyXCIsIHNsaWRlcylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZ1bmN0aW9uIHN1YnRpdGxlc0luaXQoc3VidGl0bGVzLCBzbGlkZXMpe1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coc2xpZGVzKVxuICAgICAgICAvLyAgICAgc2xpZGVzLmZvckVhY2goKHNsaWRlLCBzbGlkZUluZGV4KSA9PntcbiAgICAgICAgLy8gICAgICAgICBpZihzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoXCJfYWN0aXZlXCIpKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgc3VidGl0bGVzLmZvckVhY2goKHN1YnRpdGxlLCBzdWJ0aXRsZUluZGV4KSA9PntcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHN1YnRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoXCJfYWN0aXZlXCIpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZihzbGlkZUluZGV4ID09PSBzdWJ0aXRsZUluZGV4KXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBzdWJ0aXRsZS5jbGFzc0xpc3QuYWRkKFwiX2FjdGl2ZVwiKVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIC8vIH1cbiAgICAgICAgZnVuY3Rpb24gbW92ZVNsaWRlcihzbGlkZXMsIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAtLWN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPCAwKSBjdXJyZW50ID0gc2xpZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgKytjdXJyZW50O1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gc2xpZGVzLmxlbmd0aCAtIDEpIGN1cnJlbnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QudG9nZ2xlKFwiX2FjdGl2ZVwiLCBpID09PSBjdXJyZW50KTtcbiAgICAgICAgICAgICAgICBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLnByZWRpY3RfX3RlYW0xXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJsZWZ0LWFuaW1cIik7XG4gICAgICAgICAgICAgICAgc2xpZGUucXVlcnlTZWxlY3RvcihcIi5wcmVkaWN0X190ZWFtMlwiKS5jbGFzc0xpc3QucmVtb3ZlKFwicmlnaHQtYW5pbVwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBTbGlkZUljb25zSW5pdChzbGlkZXNJY29ucywgY3VycmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBTbGlkZUljb25zSW5pdChpY29ucywgY3VycmVudCkge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IGljb25zWzBdLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHdyYXBwZXIpXG5cbiAgICAgICAgICAgIGljb25zLmZvckVhY2goKGljb24sIGljb25JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGljb24uY2xhc3NMaXN0LnRvZ2dsZShcIl9jdXJyZW50XCIsIGN1cnJlbnQgPT09IGljb25JbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPT09IGljb25JbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpY29uT2Zmc2V0TGVmdCA9IGljb24ub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWNvbldpZHRoID0gaWNvbi5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlcldpZHRoID0gd3JhcHBlci5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpY29uT2Zmc2V0TGVmdCAtICh3cmFwcGVyV2lkdGggLyAyKSArIChpY29uV2lkdGggLyAyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgc2xpZGVzLmZvckVhY2goc2xpZGUgPT57XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdENhcmQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLnByZWRpY3RfX3RlYW0xXCIpXG4gICAgICAgICAgICAgICAgY29uc3QgcmlnaHRDYXJkID0gc2xpZGUucXVlcnlTZWxlY3RvcihcIi5wcmVkaWN0X190ZWFtMlwiKVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRDYXJkQmFjayA9IGxlZnRDYXJkLnF1ZXJ5U2VsZWN0b3IoXCIuYmFjay1pbWdcIilcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodENhcmRCYWNrID0gcmlnaHRDYXJkLnF1ZXJ5U2VsZWN0b3IoXCIuYmFjay1pbWdcIilcbiAgICAgICAgICAgICAgICBsZWZ0Q2FyZC5jbGFzc0xpc3QuYWRkKFwibGVmdC1hbmltXCIpO1xuICAgICAgICAgICAgICAgIHJpZ2h0Q2FyZC5jbGFzc0xpc3QuYWRkKFwicmlnaHQtYW5pbVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggY3VycmVudCAtIDEsIHNsaWRlcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudCArIDEgPCBzbGlkZXMubGVuZ3RoICYmIGRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKXtcbiAgICAgICAgICAgICAgICAgICAgbGVmdENhcmRCYWNrLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiLi4vaW1nL3ByZWRpY3QvbGVmdC10ZWFtLWRlc2Mke2N1cnJlbnQgKyAyfS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgICAgICByaWdodENhcmRCYWNrLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiLi4vaW1nL3ByZWRpY3QvcmlnaHQtdGVhbS1kZXNjJHtjdXJyZW50ICsgMn0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChjdXJyZW50ICsgMSA9PT0gc2xpZGVzLmxlbmd0aCAmJiBkaXJlY3Rpb24gPT09IFwicmlnaHRcIil7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4uL2ltZy9wcmVkaWN0L2xlZnQtdGVhbS1kZXNjMS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgICAgICByaWdodENhcmRCYWNrLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiLi4vaW1nL3ByZWRpY3QvcmlnaHQtdGVhbS1kZXNjMS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihjdXJyZW50IC0gMSA+IDEgJiYgZGlyZWN0aW9uID09PSBcImxlZnRcIil7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4uL2ltZy9wcmVkaWN0L2xlZnQtdGVhbS1kZXNjJHtjdXJyZW50IH0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4uL2ltZy9wcmVkaWN0L3JpZ2h0LXRlYW0tZGVzYyR7Y3VycmVudCB9LnBuZ1wiKSBuby1yZXBlYXQgMCAwL2NvbnRhaW5gXG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoY3VycmVudCAtIDEgPT09IDAgJiYgZGlyZWN0aW9uID09PSBcImxlZnRcIil7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4uL2ltZy9wcmVkaWN0L2xlZnQtdGVhbS1kZXNjJHtzbGlkZXMubGVuZ3RofS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgICAgICByaWdodENhcmRCYWNrLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiLi4vaW1nL3ByZWRpY3QvcmlnaHQtdGVhbS1kZXNjJHtzbGlkZXMubGVuZ3RofS5wbmdcIikgbm8tcmVwZWF0IDAgMC9jb250YWluYFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGxlZnRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbW92ZVNsaWRlcihzbGlkZXMsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgcmlnaHRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiaW5pdGlhbFwiO1xuICAgICAgICAgICAgICAgIGxlZnRCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiaW5pdGlhbFwiO1xuICAgICAgICAgICAgICAgIHNldFNjb3JlKDEpXG4gICAgICAgICAgICAgICAgc2V0U2NvcmUoMilcbiAgICAgICAgICAgICAgICAvLyBpbml0U2NvcmVTZWxlY3RvcigxKTtcbiAgICAgICAgICAgICAgICAvLyBpbml0U2NvcmVTZWxlY3RvcigyKTtcbiAgICAgICAgICAgICAgICBpZihjb3ZlcmZsb3cpe1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXMuZm9yRWFjaChzbGlkZSA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJyaWdodC1jb3ZlclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImxlZnQtY292ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJnbGl0Y2hcIilcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgY292ZXJGbG93Q2xhc3NlcyhcInJpZ2h0LWNvdmVyXCIsIFwibGVmdC1jb3ZlclwiLCBzbGlkZXMpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxlZnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGhhbmRsZUNsaWNrKFwibGVmdFwiKSk7XG4gICAgICAgIHJpZ2h0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBoYW5kbGVDbGljayhcInJpZ2h0XCIpKTtcblxuICAgICAgICBzbGlkZXNJY29ucy5mb3JFYWNoKChpY29uLCBpKSA9PiB7XG4gICAgICAgICAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIl9jdXJyZW50XCIpKSByZXR1cm5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzSWNvbnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcIl9jdXJyZW50XCIpKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICBzbGlkZXNJY29ucy5mb3JFYWNoKGljb24gPT57XG4gICAgICAgICAgICAgICAgICAgIGljb24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiXG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICBsZWZ0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcblxuICAgICAgICAgICAgICAgIHNsaWRlc1tjdXJyZW50XS5jbGFzc0xpc3QuYWRkKFwiZ2xpdGNoXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBpO1xuICAgICAgICAgICAgICAgIHNsaWRlcy5mb3JFYWNoKHNsaWRlID0+e1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Q2FyZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJlZGljdF9fdGVhbTFcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmlnaHRDYXJkID0gc2xpZGUucXVlcnlTZWxlY3RvcihcIi5wcmVkaWN0X190ZWFtMlwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Q2FyZEJhY2sgPSBsZWZ0Q2FyZC5xdWVyeVNlbGVjdG9yKFwiLmJhY2staW1nXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q2FyZEJhY2sgPSByaWdodENhcmQucXVlcnlTZWxlY3RvcihcIi5iYWNrLWltZ1wiKVxuICAgICAgICAgICAgICAgICAgICBsZWZ0Q2FyZC5jbGFzc0xpc3QuYWRkKFwibGVmdC1hbmltXCIpO1xuICAgICAgICAgICAgICAgICAgICByaWdodENhcmQuY2xhc3NMaXN0LmFkZChcInJpZ2h0LWFuaW1cIik7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4uL2ltZy9wcmVkaWN0L2xlZnQtdGVhbS1kZXNjJHtjdXJyZW50ICsgMX0ucG5nXCIpIG5vLXJlcGVhdCAwIDAvY29udGFpbmBcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRDYXJkQmFjay5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4uL2ltZy9wcmVkaWN0L3JpZ2h0LXRlYW0tZGVzYyR7Y3VycmVudCArIDF9LnBuZ1wiKSBuby1yZXBlYXQgMCAwL2NvbnRhaW5gXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgU2xpZGVJY29uc0luaXQoc2xpZGVzSWNvbnMsIGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QudG9nZ2xlKFwiX2FjdGl2ZVwiLCBpbmRleCA9PT0gY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Q2FyZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJlZGljdF9fdGVhbTFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q2FyZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJlZGljdF9fdGVhbTJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJsZWZ0LWFuaW1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodENhcmQuY2xhc3NMaXN0LnJlbW92ZShcInJpZ2h0LWFuaW1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiZ2xpdGNoXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3VidGl0bGVzSW5pdChzdWJ0aXRsZXMsIHNsaWRlcylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImluaXRpYWxcIjtcbiAgICAgICAgICAgICAgICAgICAgbGVmdEJ0bi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc0ljb25zLmZvckVhY2goaWNvbiA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiaW5pdGlhbFwiXG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgc2V0U2NvcmUoMSlcbiAgICAgICAgICAgICAgICAgICAgc2V0U2NvcmUoMilcblxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBTbGlkZUljb25zSW5pdChzbGlkZXNJY29ucywgY3VycmVudCk7XG4gICAgICAgIC8vIHN1YnRpdGxlc0luaXQoc3VidGl0bGVzLCBzbGlkZXMpXG5cbiAgICB9XG5cbiAgICBjcmVhdGVTbGlkZXIoXCIucHJlZGljdF9fY291bnRlclwiLCBcIi5wcmVkaWN0X19tb3ZlLWxlZnRcIiwgXCIucHJlZGljdF9fbW92ZS1yaWdodFwiLCBcIi5wcmVkaWN0X19pY29ucy1pdGVtXCIsIDEsIG51bGwsIFwicGVycy5wbmdcIiwgbnVsbCwgZmFsc2UsIG51bGwsIG51bGwsIHRydWUpXG5cbn0pKCk7XG4iXX0=
