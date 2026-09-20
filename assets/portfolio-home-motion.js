(() => {
  const main = document.querySelector("main[data-template='index']");
  const scrollContainer = document.querySelector('.page-wrapper') || window;

  if (!main || main.dataset.portfolioMotionInitialized === 'true') return;

  main.dataset.portfolioMotionInitialized = 'true';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealElements = Array.from(
    main.querySelectorAll(
      [
        '.portfolio-services__inner',
        '.portfolio-projects__inner',
        '.portfolio-tech-stack__inner',
        '.portfolio-about__content',
        '.portfolio-cta__inner',
      ].join(',')
    )
  );
  const parallaxItems = [
    { image: main.querySelector('.portfolio-hero__image'), section: main.querySelector('.portfolio-hero'), distance: 190 },
    { image: main.querySelector('.portfolio-about__image'), section: main.querySelector('.portfolio-about'), distance: 150 },
    { image: main.querySelector('.portfolio-cta__image'), section: main.querySelector('.portfolio-cta'), distance: 150 },
  ].filter((item) => item.image && item.section);

  revealElements.forEach((element) => element.classList.add('portfolio-motion-reveal'));
  parallaxItems.forEach(({ image }) => image.classList.add('portfolio-motion-parallax'));
  main.classList.add('portfolio-motion-ready');

  let framePending = false;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const updateMotion = () => {
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth < 750;
    const travel = isMobile ? 130 : 220;
    const sidewaysTravel = isMobile ? 20 : 64;
    const documentElement = document.documentElement;
    const windowScrollable = documentElement.scrollHeight > viewportHeight + 2;
    const windowAtBottom =
      windowScrollable && window.scrollY + viewportHeight >= documentElement.scrollHeight - 2;
    const containerScrollable =
      scrollContainer !== window && scrollContainer.scrollHeight > scrollContainer.clientHeight + 2;
    const containerAtBottom =
      containerScrollable &&
      scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2;
    const pageAtBottom = windowAtBottom || containerAtBottom;

    revealElements.forEach((element, index) => {
      const bounds = element.getBoundingClientRect();
      const start = viewportHeight * 1.02;
      const finish = viewportHeight * 0.18;
      const isFinalSection = index === revealElements.length - 1;
      const progress = isFinalSection && pageAtBottom ? 1 : clamp((start - bounds.top) / (start - finish), 0, 1);
      const easedProgress = progress * progress * (3 - 2 * progress);
      const direction = index % 2 === 0 ? -1 : 1;

      element.style.setProperty('--portfolio-reveal-opacity', (0.04 + easedProgress * 0.96).toFixed(3));
      element.style.setProperty(
        '--portfolio-reveal-x',
        `${((1 - easedProgress) * sidewaysTravel * direction).toFixed(2)}px`
      );
      element.style.setProperty('--portfolio-reveal-y', `${((1 - easedProgress) * travel).toFixed(2)}px`);
      element.style.setProperty('--portfolio-reveal-scale', (0.9 + easedProgress * 0.1).toFixed(4));
    });

    parallaxItems.forEach(({ image, section, distance }) => {
      const bounds = section.getBoundingClientRect();

      if (bounds.bottom < -viewportHeight || bounds.top > viewportHeight * 2) return;

      const progress = clamp((viewportHeight - bounds.top) / (viewportHeight + bounds.height), 0, 1);
      const offset = (progress - 0.5) * distance;

      image.style.setProperty('--portfolio-parallax-y', `${offset.toFixed(2)}px`);
    });

    framePending = false;
  };

  const requestMotionUpdate = () => {
    if (framePending) return;

    framePending = true;
    requestAnimationFrame(updateMotion);
  };

  updateMotion();
  window.addEventListener('scroll', requestMotionUpdate, { passive: true });

  if (scrollContainer !== window) {
    scrollContainer.addEventListener('scroll', requestMotionUpdate, { passive: true });
  }

  window.addEventListener('resize', requestMotionUpdate, { passive: true });
})();
