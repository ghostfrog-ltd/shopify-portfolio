class PortfolioBlogPost {
  constructor(root) {
    this.root = root;
    this.content = root.querySelector('[data-article-content]');
    this.toc = root.querySelector('[data-article-toc]');
    this.tocList = root.querySelector('[data-article-toc-list]');
    this.copyButton = root.querySelector('[data-copy-link]');

    this.buildTableOfContents();
    this.bindCopyLink();
  }

  buildTableOfContents() {
    if (!this.content || !this.toc || !this.tocList) return;

    const headings = [...this.content.querySelectorAll('h2, h3')];

    if (!headings.length) {
      this.toc.hidden = true;
      return;
    }

    const usedIds = new Set();

    headings.forEach((heading, index) => {
      let id = heading.id || this.slugify(heading.textContent) || `article-heading-${index + 1}`;
      const baseId = id;
      let duplicate = 2;

      while (usedIds.has(id) || document.getElementById(id)) {
        if (heading.id === id) break;
        id = `${baseId}-${duplicate}`;
        duplicate += 1;
      }

      heading.id = id;
      usedIds.add(id);

      const item = document.createElement('li');
      item.dataset.level = heading.tagName.slice(1);

      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent.trim();

      item.append(link);
      this.tocList.append(item);
    });
  }

  bindCopyLink() {
    if (!this.copyButton) return;

    this.copyButton.addEventListener('click', async () => {
      const label = this.copyButton.querySelector('[data-copy-text]');
      const successLabel = this.copyButton.dataset.copyLabel || 'Copied';

      try {
        await navigator.clipboard.writeText(window.location.href);
        if (label) label.textContent = successLabel;
      } catch (_error) {
        const input = document.createElement('textarea');
        input.value = window.location.href;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        if (label) label.textContent = successLabel;
      }
    });
  }

  slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

document.querySelectorAll('[data-portfolio-article]').forEach((root) => new PortfolioBlogPost(root));
