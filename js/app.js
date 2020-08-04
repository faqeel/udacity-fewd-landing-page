/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */

window.addEventListener('DOMContentLoaded', () => {
  const vh = window.innerHeight;

  const navbarMenu = document.querySelector('.navbar__menu');
  const navbarList = document.querySelector('#navbar__list');
  const sections = document.querySelectorAll('main section');
  const scrollToTopButton = document.querySelector('.top__button');
  let menuLinks;

  // Elements that will hide while not scrolling
  const hideModeElements = [
    {
      element: document.querySelector('.page__header'),
      direction: 'top',
    },
    {
      element: scrollToTopButton,
      direction: 'bottom',
    },
  ];

  let timeouts = [];
  let activeLink;

  /**
   * End Global Variables
   * Start Helper Functions
   *
   */

  /**
   * @description Add an active state to navigation item which its section in the viewport
   * @param {string} id - The id of the section
   */
  const setActiveLink = (id) => {
    for (const link of menuLinks) {
      if (link.getAttribute('data-section') === id) {
        activeLink = link;
        activeLink.classList.add('link__active');
      } else {
        link.classList.remove('link__active');
      }
    }
  };

  /**
   * @description Add an active state to section that is active in the viewport
   * @param {string} id - The id of the section
   */
  const setActiveSection = (id) => {
    for (const section of sections) {
      if (section.id === id) {
        section.classList.add('your-active-class');
      } else {
        section.classList.remove('your-active-class');
      }
    }
  };

  /**
   * @description Remove certain class from an elements
   * @param {iterable_object} list - List of elements
   * @param {string} className - The target class
   */
  const unset = (list, className) => {
    list.forEach((item) => item.classList.remove(className));
  };

  /**
   * @description Hide certain elements while not scrolling
   * @param {number} timeout - The timeout to start the hide mode
   */
  const startHideMode = (timeout) => {
    clearTimeouts(timeouts);
    for (const elm of hideModeElements) {
      const { element, direction } = elm;
      element.style[direction] = 0;
      timeouts.push(
        setTimeout(() => {
          element.style[direction] = -(element.offsetHeight * 10) + 'px';
        }, timeout)
      );
    }
  };

  /**
   * @description Clear setTimeout() that have been set
   * @param {iterable_object} list - The timeout to start the hide mode
   */
  const clearTimeouts = (list) => {
    list.forEach((timeout) => window.clearTimeout(timeout));
  };

  /**
   * @description Determine the visibility of "scroll to top" button
   */
  const scrollToTopVisibility = () => {
    scrollToTopButton.style.bottom = window.pageYOffset > 200 ? 0 : -(scrollToTopButton.offsetHeight * 10) + 'px';
  };

  /**
   * @description Reset all settings and positions that affected by scrolling
   */
  const resetAll = () => {
    clearTimeouts(timeouts);
    unset(menuLinks, 'link__active');
    activeLink = null;
    unset(sections, 'your-active-class');
    scrollToTopVisibility();
    adjustActiveLinkPosition();
  };

  /**
   * @description Return the offsetTop of a section
   * @param {string} id - The id of the section
   */
  const getOffsetTop = (id) => {
    for (const section of sections) {
      if (section.id === id) return section.offsetTop;
    }
  };

  /**
   * @description Adjust navbar position
   */
  const adjustActiveLinkPosition = () => {
    if (activeLink) {
      const elm = activeLink.getBoundingClientRect();
      navbarMenu.scrollLeft += elm.x - elm.width / 2;
    } else {
      navbarMenu.scrollLeft = 0;
    }
  };

  /**
   * End Helper Functions
   * Begin Main Functions
   *
   */

  // build the nav
  const addSectionToNav = ({ id, dataset: { nav: name } }) => {
    const li = document.createElement('li');
    li.setAttribute('data-section', `${id}`);
    li.setAttribute('class', 'menu__link');
    li.innerHTML = name;
    navbarList.appendChild(li);
  };

  // Add class 'active' to section when near top of viewport
  const updateActiveSection = ({ id }) => {
    setActiveLink(id);
    setActiveSection(id);
  };

  // Scroll to anchor ID using scrollTO event
  const scrollToSection = (event) => {
    const {
      dataset: { section },
    } = event.target;
    window.scrollTo({
      top: getOffsetTop(section),
      behavior: 'smooth',
    });
  };

  /**
   * End Main Functions
   * Begin Events
   *
   */

  // Build menu
  sections.forEach((section) => addSectionToNav(section));
  menuLinks = document.querySelectorAll('.menu__link');

  // Scroll to section on link click
  menuLinks.forEach((link) => link.addEventListener('click', scrollToSection));

  // Set sections as active
  window.addEventListener('scroll', () => {
    if (Math.round(window.pageYOffset) === 0) {
      resetAll();
    } else {
      scrollToTopVisibility();
      startHideMode(2000);
      sections.forEach((section) => {
        const elm = section.getBoundingClientRect();
        if (elm.top <= vh * 0.4 && elm.bottom > vh * 0.4) {
          updateActiveSection(section);
          adjustActiveLinkPosition();
        }
      });
    }
  });

  // Scroll to top on "scroll to top" button click
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});
