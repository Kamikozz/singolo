/**
 * Returns name of the found className or undefined
 * @param {DOMTokenList} list array of classes in which to find
 * @param {String} className string of the className which must be found
 * @returns {String|undefined} name of the found class or undefined
 */
function curClass(list, className) {
  for (let i = list.length - 1; i > 0; i--) {
    if (list[i].indexOf(className) !== -1) {
      return list[i];
    }
  }
}

/**
 * Changes the section slider's color
 * @param {String} direction indicates the direction 'left'/'right'
 * @param {Array} slidesList array of 'slide-1', 'slide-2', 'slide-3', etc.
 */
function changeSliderColor(direction, slidesList) {
  // get the whole section element
  const outerSliderSection = document.querySelector('main section.carousel');

  // get the section element's class with 'slide'
  const SLIDE = 'slide';
  const previousClassName = curClass(outerSliderSection.classList, SLIDE);

  // get this class (previous class) slide id
  const slideId = Number(previousClassName.split('-')[1]) - 1;
  
  // get new class name
  let newClassName;
  switch (direction) {
    case 'left': {
      newClassName = (slideId - 1 >= 0)
      ? slidesList[slideId - 1]
      : slidesList[slidesList.length - 1];
      break;
    }
    case 'right': {
      newClassName = (slideId + 1 < slidesList.length)
      ? slidesList[slideId + 1]
      : slidesList[0];
      break;
    }
    default: break;
  }

  // remove this class (previous class) and add new class
  outerSliderSection.classList.replace(previousClassName, newClassName);
}

/**
 * Shuffles the given array by Fisher and Yates method
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Fisher_and_Yates'_original_method
 * @param {Array|HTMLCollection} arr source array which must be shuffled
 * @returns {Array|HTMLCollection} shuffled array of elements
 */
function shuffleFisherYates(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let randomIdx = Math.random() * (i + 1) | 0;
    [arr[i], arr[randomIdx]] = [arr[randomIdx], arr[i]]; // swap elements
  }
  return arr;
}

/**
 * Shuffles the given array by Fisher and Yates method
 * and guarantees that numbers from shuffled array are not equal to
 * the items from source array
 * @param {Array|HTMLCollection} arr source array which must be shuffled
 * @returns {Array|HTMLCollection} shuffled array of elements
 */
function shuffle(array) {
  const arr = [...array];

  // Fisher and Yates method
  const shuffledArr =  shuffleFisherYates(arr);

  for (let i = 0; i < shuffledArr.length; i++) {
    if (shuffledArr[i] === arr[i]) {
      if (i + 1 === shuffledArr.length) {
        // reach the end? -> swap first & last element
        [shuffledArr[i], shuffledArr[0]] = [shuffledArr[0], shuffledArr[i]];
      } else {
        // default action -> swap this & last element
        [shuffledArr[i], shuffledArr[shuffledArr.length - 1]] =
          [shuffledArr[shuffledArr.length - 1], shuffledArr[i]];
      }
    }
  }

  return shuffledArr;
}

/**
 * Deletes active className and sets to new activated tab
 * @param {HTMLElement} previousTab last tab
 * @param {HTMLElement} nextTab event.target or other new activated tab
 */
function toggleActiveTab(previousTab, nextTab) {
  previousTab.classList.remove(ACTIVE_NAME);
  nextTab.classList.add(ACTIVE_NAME);
}

/**
 * Toggles pop up. If unhide = true, then unhide, add overflow:hidden.
 * Else hide, delete overflow: hidden
 * @param {HTMLElement} element what element is pop up
 * @param {Boolean} unhide if true -> unhides pop-up, animation pop-up; if false -> hides pop-up, animation pop-down
 */
function togglePopUp(element, unhide) {
  // clear pop-up & pop-down classes
  // to prevent setting the wrong classes by fast clicks by user
  element.classList.remove(POP_UP);
  element.classList.remove(POP_DOWN);

  if (unhide) {
    quoteModalWindow.classList.toggle(HIDDEN);
    document.body.style.overflow = 'hidden';

    element.classList.toggle(POP_UP);
  } else {
    document.body.style.removeProperty('overflow');

    element.classList.add(POP_DOWN);
  }
}

// Event handlers
// ------------------------- Common ------------------------- //
function handlerPageScroll(e) {
  // get the currentLink as id '#name' and delete # -> 'name'
  const currentLinkName =
    lastHeaderMenuActiveTab.getAttribute('href').substring(1);
  const currentLinkYOffset = anchors[currentLinkName].offsetTop;

  const difference = 30; // gap between 2 anchors
  if (currentLinkYOffset - window.pageYOffset > difference) {
    // get previous tab
    const prevLink = lastHeaderMenuActiveTab
                      .parentElement
                      .previousElementSibling
                      .firstElementChild;

    // switch to previous tab
    toggleActiveTab(lastHeaderMenuActiveTab, prevLink);
    lastHeaderMenuActiveTab = prevLink;
    return;
  }

  // get next tab
  const nextLink = lastHeaderMenuActiveTab
                    .parentElement
                    .nextElementSibling
                    .firstElementChild;
  const nextLinkName = nextLink.getAttribute('href').substring(1);
  const nextLinkYOffset = anchors[nextLinkName].offsetTop;
  if (nextLinkYOffset - window.pageYOffset < difference) {
    // switch to next tab
    toggleActiveTab(lastHeaderMenuActiveTab, nextLink);
    lastHeaderMenuActiveTab = nextLink;
  }

   if (isReachEnd()) {
    // console.log('event', isScrollEvent);
    if (isScrollEvent) {
      let nextElement = lastHeaderMenuActiveTab.parentElement.nextElementSibling;
      let i = 1;
      while (nextElement !== null) {
        setTimeout((next) => {
          toggleActiveTab(lastHeaderMenuActiveTab, next);
          lastHeaderMenuActiveTab = next;
        }, 100 * i, nextElement.firstElementChild);
        i++;
        nextElement = nextElement.nextElementSibling;
      }
    } else {
      // TODO: пофиксить баг, когда мы кликаем по табам включается "false"
      // и дойдя до конца не ставится нужный таб, не доводится, и если масштаб иной
      // console.log(lastHeaderMenuActiveTab);

      let nextElement = lastHeaderMenuActiveTab.parentElement.nextElementSibling;
      let i = 1;
      while (nextElement !== null) {
        setTimeout((next) => {
          toggleActiveTab(lastHeaderMenuActiveTab, next);
          lastHeaderMenuActiveTab = next;
        }, 100 * i, nextElement.firstElementChild);
        i++;
        nextElement = nextElement.nextElementSibling;
      }
      // scroll from lastHeaderMenuActiveTab

      // TODO: fix smooth animation
      // setTimeout((next) => {
      //   toggleActiveTab(lastHeaderMenuActiveTab, next);
      //   lastHeaderMenuActiveTab = next;
      // }, 2000, lastHeaderMenuClickedTab);
      isScrollEvent = true;
    }
  }

  function isReachEnd() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    return window.scrollY + 1 >= scrollHeight - clientHeight;
  }
}

// --------------------- Header section --------------------- //
function handlerHeaderBurgerMenuButton(e) {
  burgerMenuButton.classList.add(DISABLED);

  burgerMenuButtonOpen.classList.toggle(ACTIVE_NAME);
  burgerMenuLogoOpen.classList.toggle(ACTIVE_NAME);

  if (burgerMenuOpen.classList.value.indexOf(ACTIVE_NAME) !== -1) {
    burgerMenuOpen.style.animationName = ANIMATION_HIDE_BURGER;
  } else {
    burgerMenuOpen.classList.toggle(ACTIVE_NAME);
  }
}

function handlerHeaderBurgerMenuButtonEndAnimation(e) {
  burgerMenuButton.classList.remove(DISABLED);

  if (e.target.style.animationName === ANIMATION_HIDE_BURGER) {
    e.target.removeAttribute('style');
    burgerMenuOpen.classList.toggle(ACTIVE_NAME);
  }
}

function handlerHeaderMenu(e) {
  let target;
  if (window.innerWidth <= 767) {
    target = e.target.tagName === 'LI' ? e.target.firstElementChild : e.target;
  } else {
    if (e.target.tagName !== 'A') return;
    target = e.target;
  }

  if (lastHeaderMenuActiveTab === target) return;

  toggleActiveTab(lastHeaderMenuActiveTab, target);

  lastHeaderMenuActiveTab = target;
  lastHeaderMenuClickedTab = lastHeaderMenuActiveTab;
  isScrollEvent = false;

  if (window.innerWidth <= 767) {
    target.click(); // click on the item, to cause default event on the anchor
  }
}

// --------------------- Slider section --------------------- //
function handlerLeftSlide(e) {
  e.target.classList.toggle(DISABLED);

  changeSliderColor('left', SLIDES);
  if (firstRun) {
    firstRun = !firstRun;
    slide1.classList.remove(HIDDEN);
    slide2.classList.remove(HIDDEN);
  }

  if (currentView.classList.value.indexOf('slide-1') !== -1) {
    console.log('It was Slide-1!');

    console.log('Current', currentView);
    console.log('slide1: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide1);
    if (currentClass.slide1 !== ANIMATION3) {
      currentClass.slide1 = ANIMATION3;
    } else {
      currentClass.slide1 = ANIMATION4;
    }
    currentView.classList.add(currentClass.slide1);

    console.log('slide1: CurrentClass AFTER', currentClass);

    currentView = slide2; // change slide1 -> slide2

    console.log('slide2: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide2);
    if (currentClass.slide2 !== ANIMATION4) {
      currentClass.slide2 = ANIMATION4;
    } else {
      currentClass.slide2 = ANIMATION3;
    }
    currentView.classList.add(currentClass.slide2);

    console.log('slide2: CurrentClass AFTER', currentClass);

    console.log('Now it is Slide-2!');
    // console.log('End of Slide1:', slide1.classList, slide2.classList);
  } else {
    console.log('It was Slide-2!');

    console.log('slide2: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide2);
    if (currentClass.slide1 === ANIMATION3 ||
      currentClass.slide1 === ANIMATION4) {
      if (currentClass.slide2 !== ANIMATION4) {
        currentClass.slide2 = ANIMATION4;
      } else {
        currentClass.slide2 = ANIMATION3;
      }
    } else {
      currentClass.slide2 = ANIMATION3;
    }
    currentView.classList.add(currentClass.slide2);

    console.log('slide2: CurrentClass AFTER', currentClass);

    currentView = slide1; // change slide2 -> slide1

    console.log('slide1: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide1);
    if (currentClass.slide1 === ANIMATION3 ||
      currentClass.slide1 === ANIMATION4) {
      if (currentClass.slide1 !== ANIMATION3) {
        currentClass.slide1 = ANIMATION3;
      } else {
        currentClass.slide1 = ANIMATION4;
      }
    } else {
      currentClass.slide1 = ANIMATION4;
    }
    currentView.classList.add(currentClass.slide1);
    
    console.log('slide1: CurrentClass AFTER', currentClass);

    console.log('Now it is Slide-1!');
  }
}

function handlerRightSlide(e) {
  e.target.classList.toggle(DISABLED);

  changeSliderColor('right', SLIDES);
  if (firstRun) {
    firstRun = !firstRun;
    slide1.classList.remove(HIDDEN);
    slide2.classList.remove(HIDDEN);
  }

  if (currentView.classList.value.indexOf('slide-1') !== -1) {
    console.log('It was Slide-1!');

    console.log('Current', currentView);
    console.log('slide1: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide1);
    if (currentClass.slide1 !== ANIMATION2) {
      currentClass.slide1 = ANIMATION2;
    } else {
      currentClass.slide1 = ANIMATION1;
    }
    currentView.classList.add(currentClass.slide1);

    console.log('slide1: CurrentClass AFTER', currentClass);

    currentView = slide2; // change slide1 -> slide2

    console.log('slide2: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide2);
    if (currentClass.slide2 !== ANIMATION1) {
      currentClass.slide2 = ANIMATION1;
    } else {
      currentClass.slide2 = ANIMATION2;
    }
    currentView.classList.add(currentClass.slide2);

    console.log('slide2: CurrentClass AFTER', currentClass);

    console.log('Now it is Slide-2!');
    // console.log('End of Slide1:', slide1.classList, slide2.classList);
  } else {
    console.log('It was Slide-2!');

    console.log('Current', currentView);
    console.log('slide2: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide2);
    if (currentClass.slide1 === ANIMATION1 ||
      currentClass.slide1 === ANIMATION2) {
      if (currentClass.slide2 !== ANIMATION1) {
        currentClass.slide2 = ANIMATION1;
      } else {
        currentClass.slide2 = ANIMATION2;
      }
    } else {
      currentClass.slide2 = ANIMATION2;
    }
    currentView.classList.add(currentClass.slide2);

    console.log('slide2: CurrentClass AFTER', currentClass);

    currentView = slide1; // make slide2 -> slide1

    console.log('slide1: CurrentClass BEFORE', currentClass);
    currentView.classList.remove(currentClass.slide1);
    if (currentClass.slide1 === ANIMATION1 ||
      currentClass.slide1 === ANIMATION2) {
      if (currentClass.slide1 !== ANIMATION2) {
        currentClass.slide1 = ANIMATION2;
      } else {
        currentClass.slide1 = ANIMATION1;
      }
    } else {
      currentClass.slide1 = ANIMATION1;
    }
    currentView.classList.add(currentClass.slide1);

    console.log('slide1: CurrentClass AFTER', currentClass);

    console.log('Now it is Slide-1!');
  }
}

function handlerSliderFastClicks(e) {
  if (leftArrow.classList.value.indexOf(DISABLED) !== -1) {
    leftArrow.classList.toggle(DISABLED);
  }

  if (rightArrow.classList.value.indexOf(DISABLED) !== -1) {
    rightArrow.classList.toggle(DISABLED);
  }
}

function handlerSliderButtonUnlockIPhone(index) {
  lockedScreens[index].classList.toggle('locked');
}

// --------------------- Portfolio section --------------------- //
function handlerPortfolioTabs(e) {
  if (e.target.tagName !== 'LI') return;
  if (lastPortfolioActiveTab === e.target) return;

  toggleActiveTab(lastPortfolioActiveTab, e.target);

  lastPortfolioActiveTab = e.target;

  // get children of portfolioList & shuffle them
  const shuffledArr = shuffle(portfolioList.children);

  portfolioList.append(...shuffledArr);
  // get new portfolioList with parent = 'portfolio-list'
  // const newPortfolioList = shuffledArr[0].parentElement;

  // delete from DOM the old portfolio-list
  // portfolioList.remove();

  // console.log([...portfolioList.children], [...newPortfolioList.children]);
  // remove all of the children from new portfolioList
  // (from old porfolio-list)
  // for (let i = 0; i < shuffledArr.length; i++) {
  //   newPortfolioList.childNodes[0].remove();
  // }

  // newPortfolioList.append(...shuffledArr); // add shuffled items into new portfolio
  // parent.append(newPortfolioList); // render DOM with ready new portfolio
}

function handlerPortfolioImages(e) {
  if (e.target.tagName !== 'IMG') return;
  if (lastPortfolioActiveImg === e.target) return;
  if (typeof lastPortfolioActiveImg === 'string') {
    lastPortfolioActiveImg = e.target;
  }

  toggleActiveTab(lastPortfolioActiveImg, e.target);

  lastPortfolioActiveImg = e.target;
}

// ----------------------- Quote section ----------------------- //
function handlerQuoteSubmitButton(e) {
  if (quoteSubmitButton.parentElement.checkValidity()) {
    e.preventDefault();

    if (quoteSubjectField.value.length) {
      quoteModalWindowSubjectHeader.textContent = 'Тема:';
      quoteModalWindowSubjectBody.textContent = quoteSubjectField.value;
    } else {
      // set default values
      quoteModalWindowSubjectHeader.textContent = 'Без темы';
      quoteModalWindowSubjectBody.textContent = '';
    }

    if (quoteDescriptionField.value.length) {
      quoteModalWindowDescriptionHeader.textContent = 'Описание:';
      quoteModalWindowDescriptionBody.textContent = quoteDescriptionField.value;
    } else {
      // set default values
      quoteModalWindowDescriptionHeader.textContent = 'Без описания';
      quoteModalWindowDescriptionBody.textContent = '';
    }

    togglePopUp(quoteModalWindow.firstElementChild, true); //  unhide
  }
}

function handlerQuoteHideModalWindow(e) {
  if (document.body.style.getPropertyValue('overflow') !== HIDDEN) {
    quoteModalWindow.classList.toggle(HIDDEN);
  }
}

function handlerQuoteHideModalWindowOkButton(e) {
  togglePopUp(quoteModalWindow.firstElementChild, false); // hide
}

function handlerQuoteHideModalWindowOuterArea(e) {
  if (e.target.className !== MODAL_WINDOW) return;
  togglePopUp(quoteModalWindow.firstElementChild, false); // hide
}

// Constants, Variables & Event registration
// ------------------------- Common ------------------------- //
const ACTIVE_NAME = 'active';
const DISABLED = 'disabled'; // cursor-events: none;
const HIDDEN = 'hidden'; // display: none;
const MODAL_WINDOW = 'modal-window';

const anchors = document.getElementsByClassName('anchor-link');
window.addEventListener('scroll', handlerPageScroll);

// --------------------- Header section --------------------- //
// burger menu handling (small-screen)
const ANIMATION_HIDE_BURGER = 'hide-menu';
const burgerMenuButton = document.getElementsByClassName('burger-button-block')[0];
const burgerMenuButtonOpen = burgerMenuButton.firstElementChild;
const burgerMenuLogoOpen = burgerMenuButton.parentElement;
const burgerMenuOpen = document.getElementsByClassName('header__nav')[0];
burgerMenuButton.addEventListener('click', handlerHeaderBurgerMenuButton);
burgerMenuOpen.addEventListener('animationend', handlerHeaderBurgerMenuButtonEndAnimation);

// menu handling
const headerMenu = document.querySelector('.header__nav ul');
// set default active class to ul > li > a:first-child
let lastHeaderMenuActiveTab = headerMenu.firstElementChild.firstElementChild;
let lastHeaderMenuClickedTab = lastHeaderMenuActiveTab;
let isScrollEvent = true; // to store and have difference between clicked & scroll
headerMenu.addEventListener('click', handlerHeaderMenu);

// --------------------- Slider section --------------------- //
const carousel = document.getElementsByClassName('carousel');
const carouselInner = document.querySelector('div.carousel-inner');
const leftArrow = carouselInner.firstElementChild;
const rightArrow = carouselInner.lastElementChild;

let currentView = document.querySelector('div.slides.slide-1');
const slide1 = currentView;
const slide2 = slide1.nextElementSibling;
let firstRun = true; // to unhide second slide if this is first run

const ANIMATION1 = 'animation1';
const ANIMATION2 = 'animation2';
const ANIMATION3 = 'animation3';
const ANIMATION4 = 'animation4';
const currentClass = {
  slide1: 'animation',
  slide2: 'animation'
}
const SLIDE = 'slide';
const SLIDES = ['slide-1', 'slide-2'];

leftArrow.addEventListener('click', handlerLeftSlide);
rightArrow.addEventListener('click', handlerRightSlide);

currentView.addEventListener('animationend', handlerSliderFastClicks);

const buttonsUnlockIPhone = document.querySelectorAll('.button-on-screen');
const lockedScreens = document.querySelectorAll('.iphone-off-screen');
buttonsUnlockIPhone.forEach((button, i) => {
  button.addEventListener('click',
    handlerSliderButtonUnlockIPhone.bind(null, i));
});

// --------------------- Portfolio section --------------------- //
const portfolioList = document.getElementsByClassName('portfolio-list')[0];
// get parent of portfolio-list
const parent = portfolioList.parentElement; // wrapper

// tab handling
const portfolioTabs = portfolioList.previousElementSibling;
// set default active class
let lastPortfolioActiveTab = portfolioTabs.firstElementChild;
portfolioTabs.addEventListener('click', handlerPortfolioTabs);

// images handling
let lastPortfolioActiveImg = '';
portfolioList.addEventListener('click', handlerPortfolioImages);

// ----------------------- Quote section ----------------------- //
const quoteSubmitButton = document.getElementsByClassName('quote-form')[0].lastElementChild;
const quoteDescriptionField = quoteSubmitButton.previousElementSibling.lastElementChild;
const quoteSubjectField = quoteDescriptionField.previousElementSibling;

const quoteModalWindow = document.getElementsByClassName(MODAL_WINDOW)[0];

const quoteModalWindowSubjectHeader = quoteModalWindow.firstElementChild.firstElementChild.nextElementSibling;
const quoteModalWindowSubjectBody = quoteModalWindowSubjectHeader.nextElementSibling;
const quoteModalWindowDescriptionHeader = quoteModalWindowSubjectBody.nextElementSibling;
const quoteModalWindowDescriptionBody = quoteModalWindowDescriptionHeader.nextElementSibling;

const quoteModalWindowOkButton = quoteModalWindowDescriptionBody.nextElementSibling;

// animation names for quote modal window
const POP_UP = 'pop-up';
const POP_DOWN = 'pop-down';

quoteSubmitButton.addEventListener('click', handlerQuoteSubmitButton);

quoteModalWindow.addEventListener('animationend', handlerQuoteHideModalWindow);

quoteModalWindowOkButton.addEventListener('click', handlerQuoteHideModalWindowOkButton);
quoteModalWindow.addEventListener('click', handlerQuoteHideModalWindowOuterArea);