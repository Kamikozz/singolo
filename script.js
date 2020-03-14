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

// Event handlers
// ------------------------- Common ------------------------- //
function handlerPageScroll(e) {
  // get the currentLink as id '#name' and delete # -> 'name'
  const currentLinkName =
    lastHeaderMenuActiveTab.getAttribute('href').substring(1);
  const currentLinkYOffset = anchors[currentLinkName].offsetTop;

  const difference = 10; // gap between 2 anchors
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
function handlerHeaderMenu(e) {
  if (e.target.tagName !== 'A') return;
  if (lastHeaderMenuActiveTab === e.target) return;

  toggleActiveTab(lastHeaderMenuActiveTab, e.target);

  lastHeaderMenuActiveTab = e.target;
  lastHeaderMenuClickedTab = lastHeaderMenuActiveTab;
  isScrollEvent = false;
}

// --------------------- Slider section --------------------- //
function handlerLeftSlide(e) {
  changeSliderColor('left', SLIDES);

  // console.log(e);
  const slide1 = document.querySelector('div.slides.slide-1');
  const slide2 = slide1.nextElementSibling;

  if (currentView.classList.value.indexOf('slide-1') !== -1) {
    console.log('Slide-1!');

    currentView.classList.remove(currentClass.slide1);
    if (currentClass.slide1 !== ANIMATION3) {
      currentView.classList.add(ANIMATION3);
    } else {
      currentView.classList.add(ANIMATION4);
    }
    currentView.classList.add('hidden');
    currentClass.slide1 = ANIMATION3;

    currentView = slide2;

    currentView.classList.remove(currentClass.slide2);
    currentView.classList.remove('hidden');
    if (currentClass.slide2 !== ANIMATION3) {
      currentView.classList.add(ANIMATION3);
    } else {
      currentView.classList.add(ANIMATION4);
    }
    currentClass.slide2 = ANIMATION4;

    console.log('End of Slide1:', slide1.classList, slide2.classList);
  } else {
    console.log('Slide-2!');

    // console.log('Current classList Slide-2:', currentView.classList);
    currentView.classList.remove(currentClass.slide2);
    // console.log('Current classList Slide-2:', currentView.classList);
    if (currentClass.slide1 !== ANIMATION3) {
      currentView.classList.add(ANIMATION3);
    } else {
      currentView.classList.add(ANIMATION4);
    }
    currentView.classList.add('hidden');
    currentClass.slide2 = ANIMATION4;

    currentView = slide1;

    currentView.classList.remove(currentClass.slide1);
    currentView.classList.remove('hidden');
    if (currentClass.slide2 !== ANIMATION3) {
      currentView.classList.add(ANIMATION3);
    } else {
      currentView.classList.add(ANIMATION4);
    }
    currentClass.slide1 = ANIMATION3;
    // console.log('End of Slide2:', slide1.classList, slide2.classList);
  }
  // currentView.classList.add()
  // if (currentView.)
}

function handlerRightSlide(e) {
  changeSliderColor('right', SLIDES);
}

// --------------------- Portfolio section --------------------- //
function handlerPortfolioTabs(e) {
  if (e.target.tagName !== 'LI') return;
  if (lastPortfolioActiveTab === e.target) return;

  toggleActiveTab(lastPortfolioActiveTab, e.target);

  lastPortfolioActiveTab = e.target;

  // get children of portfolioList & shuffle them
  const arr = shuffle(portfolioList.children);


  // get new portfolioList with parent = 'portfolio-list'
  const newPortfolioList = arr[0].parentElement;

  // delete from DOM the old portfolio-list
  portfolioList.remove();

  // remove all of the children from new portfolioList
  // (from old porfolio-list)
  for (let i = 0; i < arr.length; i++) {
    newPortfolioList.childNodes[0].remove();
  }

  newPortfolioList.append(...arr); // add shuffled items into new portfolio
  parent.append(newPortfolioList); // render DOM with ready new portfolio
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

// Constants, Variables & Event registration
// ------------------------- Common ------------------------- //
const ACTIVE_NAME = 'active';

const anchors = document.getElementsByClassName('anchor-link');
window.addEventListener('scroll', handlerPageScroll);

// --------------------- Header section --------------------- //
// menu handling
const headerMenu = document.querySelector('.header nav ul');
// set default active class to ul > li > a:first-child
let lastHeaderMenuActiveTab = headerMenu.firstElementChild.firstElementChild;
let lastHeaderMenuClickedTab = lastHeaderMenuActiveTab;
let isScrollEvent = true;
headerMenu.addEventListener('click', handlerHeaderMenu);

// --------------------- Slider section --------------------- //
const carousel = document.getElementsByClassName('carousel');
const carouselInner = document.querySelector('div.carousel-inner');
const leftArrow = carouselInner.firstElementChild;
const rightArrow = carouselInner.lastElementChild;
// console.log(leftArrow);
// console.log(rightArrow);

let currentView = document.querySelector('div.slides.slide-1');

const ANIMATION1 = 'animation1';
const ANIMATION2 = 'animation2';
const ANIMATION3 = 'animation3';
const ANIMATION4 = 'animation4';

let currentClass = {
  slide1: 'animation',
  slide2: 'animation'
}

const SLIDE = 'slide';
const SLIDES = ['slide-1', 'slide-2'];
// const SLIDES_LIST = {
//   'slide-1': 'slide-1',
//   'slide-2': 'slide-2'
// }

leftArrow.addEventListener('click', handlerLeftSlide);
rightArrow.addEventListener('click', handlerRightSlide);

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