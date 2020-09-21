import CryptoJS from 'crypto-js';

export const fetchStorage = (key, nullVal) => {
  const item = window.localStorage.getItem(key);
  if (item) {
    const decrypted = CryptoJS.AES.decrypt(item, "Secret Passphrase").toString(
      CryptoJS.enc.Utf8
    );

    return JSON.parse(decrypted);
  }
  return nullVal;
};

export const setStorage = (key, item) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(item),
    "Secret Passphrase"
  );
  window.localStorage.setItem(key, encrypted);
};

export const decodeUrI = (key, param) => {
  if (key === "s") {
    return decodeURIComponent(param.replace(/[+]/, "%20"));
  }
  return decodeURIComponent(param);
};
export const getQueryParams = (search) => {
  if (!search) return;
  const obj = {};
  search = search.split("?")[1];
  search.split("&").forEach((el) => {
    el = el.split("=");
    obj[el[0]] = decodeUrI(el[0], el[1]);
  });
  return obj;
};

export const createModal = (data) => {
  const overlay = document.createElement('div');
  const close = document.createElement('div');
  close.textContent = 'x';
  close.setAttribute('style', `
    position: fixed;
    right: 30px;
    top: 30px;
    color: black;
    font-size: 25px;
    cursor: pointer;
    padding: 10px
  `);
  overlay.appendChild(close);
  close.onclick = (e) => {
    overlay.style.top = '-100%';
    overlay.style.bottom = '100%';
    document.body.style.overflow = 'auto';
  }
  // overlay.textContent = ' dgfdsggdfsgfdgdfgfg';
  overlay.setAttribute('style', `
    background-color: #ffffffeb;
    width: 100%;
    height: 100%;
    position: fixed;
    top: -100%;
    left: 0;
    right: 0;
    bottom: 100%;
    z-index: 99999;
    padding: 100px;
    transition: .3s;
    overflow: auto
  `);
  const content = document.createElement('div');
  const datakeys = Object.keys(data);
  const stringArr = datakeys.map((el) => {
    const title = `<h1 style="color: red">${el} Pages:</h1>`;
    let section = '';

    data[el].forEach(element => {
      let li = '';

      for (const k in element) {
        if (typeof element[k] === 'object') {
          let innerLI = '';
          for (const k2 in element[k]) {
            innerLI += `<li><h5 style="display:inline">${k2}:</h5> ${element[k][k2]}</li>`
          }
          li += `<li><h4 style="color:blue">${k}:</h4><ol>${innerLI}</ol></li><hr>`


        } else {
          li += `<li><h4 style="display:inline;color:blue">${k}:</h4> ${element[k]}</li><hr>`
        }
      }
      section += `${li}<hr style="color: red; border-color: red">`;
    });
    return `${title}<ol>${section}</ol><hr>`;

  });
  stringArr.forEach((el) => {

    content.innerHTML += el;
  });

  overlay.appendChild(content)
  return overlay;
}

export const createDOM = (data) => {
  const button = document.createElement('button');
  button.textContent = 'Show Data';
  button.setAttribute('style', `
  background-color: #cc4242;
  color: white;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: fixed;
  right: 50px;
  bottom: 100px;
  border: 0;
  font-size: 18px;
  box-shadow: 1px 1px 10px black;
  outline: 0;
`);
  const modal = createModal(data);
  button.onclick = (e) => {
    modal.style.top = 0;
    modal.style.bottom = 0;
    document.body.style.overflow = 'hidden';
  }

  document.body.appendChild(button)
  document.body.appendChild(modal)
}