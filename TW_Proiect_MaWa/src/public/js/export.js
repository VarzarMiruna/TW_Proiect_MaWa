//html
function exportTableToHTML() {
    const table = document.getElementById('clasament');
    const html = table.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clasament.html';
    a.click();
}
//desc in csv
function exportTableToCSV() {
    const table = document.getElementById('clasament');
    const rows = table.rows;
    let csv = '';
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let cols = row.cells;
        for (let j = 0; j < cols.length; j++) {
            if (!cols[j].innerText) {
                const img = cols[j].innerHTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(img, 'text/html');
                const imgSrc = doc.querySelector('img').getAttribute('src');
                csv += `${imgSrc}` + (j < cols.length - 1 ? ', ' : '\n');
            }
            else {
                csv += cols[j].innerText.replace(/"/g, '""') + (j < cols.length - 1 ? ',' : '\n');
            }
        }
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clasament.csv';
    a.click();
}
//json
function exportTableToJSON() {
    const table = document.getElementById('clasament');
    const rows = Array.from(table.rows);
    const headers = Array.from(rows[0].cells).map(th => th.innerText);
    const data = rows.slice(1).map(row => {
        return Array.from(row.cells).reduce((obj, cell, index) => {
            if (index === 1) {
                const img = cell.innerHTML;
                const parser = new DOMParser();
                const doc = parser.parseFromString(img, 'text/html');
                const imgSrc = doc.querySelector('img').getAttribute('src');
                obj[headers[index]] = imgSrc;
                return obj;
            }
            else {
                obj[headers[index]] = cell.innerText;
            }
            return obj;
        }, {});
    });
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clasament.json';
    a.click();
}
//rss
function exportTableToRSS() {
    const table = document.getElementById('clasament');
    const items = Array.from(table.rows);
    items.shift();
    let rss = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n';
    items.forEach(item => {
        const img = item.children[1].innerHTML;
        const parser = new DOMParser();
        const doc = parser.parseFromString(img, 'text/html');
        const imgSrc = doc.querySelector('img').getAttribute('src');
        rss += `<item>\n<pozitie>${item.children[0].innerText}</pozitie>\n<imagine>${imgSrc}</imagine>\n<nume>${item.children[2].innerText}</nume>\n<firma>${item.children[3].innerText}</firma>\n<voturi>${item.children[4].innerText}</voturi>\n</item>\n`;
    });
    rss += '</channel>\n</rss>';
    const blob = new Blob([rss], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clasament.rss';
    a.click();
}