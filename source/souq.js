window.onload = function () {
  let userId;
  let userEmail;
  const url = location.href;
  const path = location.pathname;
  const queryParams = getQueryParams(location.search);
  const pathToArr = path.split('/');
  const isMain = Boolean(path === "/eg-ar/" || path === "/eg-en/");
  const isSrearchResults = pathToArr.some(el => el === 's');
  const isProduct = pathToArr.some(el => el === 'i');
  const cookies = Cookies.get();
  const market = markets[location.host];
};
