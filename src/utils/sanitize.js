// Isi catatan berasal dari server, jadi HTML-nya dibersihkan sebelum dirender.
// Hanya tag pemformatan sederhana yang dipertahankan; semua atribut dibuang.
const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'DIV', 'P', 'SPAN']);
const DROPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED']);

function cleanNode(node) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (DROPPED_TAGS.has(child.tagName)) {
        child.remove();
        return;
      }
      cleanNode(child);
      if (ALLOWED_TAGS.has(child.tagName)) {
        Array.from(child.attributes).forEach((attr) => child.removeAttribute(attr.name));
      } else {
        child.replaceWith(...child.childNodes);
      }
    } else if (child.nodeType !== Node.TEXT_NODE) {
      child.remove();
    }
  });
}

function sanitizeHtml(html = '') {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  cleanNode(doc.body);
  return doc.body.innerHTML;
}

export { sanitizeHtml };
