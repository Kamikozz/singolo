
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

window.onload = () => {
  console.log('Window loaded');

  const carouselInner = document.querySelector('div.carousel-inner');
  const leftArrow = carouselInner.firstElementChild;
  const rightArrow = carouselInner.lastElementChild

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

  leftArrow.addEventListener('click', (e) => {
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
  });

  rightArrow.addEventListener('click', (e) => {
    changeSliderColor('right', SLIDES);
  });
};