import { createDOM, fetchStorage, getQueryParams, setStorage } from "./utils";
import Cookies from "js-cookie";

chrome.runtime.sendMessage({ todo: "showPageAction" });
chrome.runtime.onMessage.addListener((request, sender, sendResp) => {
	console.log(request);
});
window.onload = function() {
	const markets = {
		"www.amazon.com": "United States",
		"www.amazon.co.uk": "United Kingdom",
		"www.amazon.ca": "Canada",
		"www.amazon.de": "Germany",
		"www.amazon.fr": "France",
		"www.amazon.co.jp": "Japan",
		"www.amazon.br": "Brazil",
		"www.amazon.at": "Austria",
		"www.amazon.it": "Italy",
		"www.amazon.es": "Spain",
		"www.amazon.cn": "China",
		"www.amazon.com.mx": "Mexico",
		"www.amazon.com.au": "Australia", 
		"www.amazon.nl": "Netherlands",
		"www.amazon.in": "India",
		"www.amazon.sa": "Saudi Arabia",
		"www.amazon.ae": "UAE"
	};

	let userId;
	let userEmail;
	const url = location.href;
	const path = location.pathname;
	const queryParams = getQueryParams(location.search);
	const isMain = Boolean(path === "/" || path === "/ref=nav_logo");
	const isSrearchResults = Boolean(path === "/s");
	const isProduct = (() => {
		const pathArr = path.split("/");
		return pathArr.some(el => el === "dp");
	})();
	const cookies = Cookies.get();
	const market = markets[location.host];
	const product = () => {
		const productTitleElm = document.querySelector("#productTitle");
		const basePriceElm = document.querySelector("#priceblock_ourprice");
		const dealPriceElm = document.querySelector("#priceblock_dealprice");
		const title = productTitleElm ? productTitleElm.innerText : "";
		const basePrice = basePriceElm ? basePriceElm.innerText : "";
		const dealPrice = dealPriceElm ? dealPriceElm.innerText : "";
		return {
			title,
			basePrice,
			dealPrice
		};
	};

	chrome.storage.sync.get(["user"], ({ email, id }) => {
		userId = id;
		userEmail = email;
		const getUser = () => {
			const user = { id, email };
			const accountFromNavbar = document.querySelector("#nav-link-accountList");
			if (accountFromNavbar) {
				user.shortName = accountFromNavbar
					.querySelector(".nav-line-1-container .nav-line-1")
					.textContent.split(",")[1]
					.trim();
				user.loggedIn = true;
			} else {
				user.loggedIn = false;
				user.shortName = null;
			}

			return user;
		};
		const accumlateVisits = arr => {
			if (arr.length === 0) {
				return 1;
			}
			return arr.length + 1;
		};

		const calculateVisits = position => {
			const visitedMarket = fetchStorage(market, {});
			let visits;
			const basic = {
				date: new Date().toLocaleString(),
				userAgent: navigator.userAgent,
				location: position.coords,
				user: getUser(),
				cookies,
				url
			};
			if (isMain) {
				visitedMarket["main"] = visitedMarket["main"] || [];
				visits = accumlateVisits(visitedMarket["main"]);
				visitedMarket["main"].push({
					...basic,
					visits
				});
			}
			if (isSrearchResults) {
				visitedMarket["search"] = visitedMarket["search"] || [];
				visits = accumlateVisits(visitedMarket["search"]);
				visitedMarket["search"].push({
					...basic,
					searchKey: queryParams.k,
					page: queryParams.page || 0,
					visits
				});
			}
			if (isProduct) {
				visitedMarket["product"] = visitedMarket["product"] || [];
				visits = accumlateVisits(visitedMarket["product"]);
				visitedMarket["product"].push({
					...basic,
					visits,
					product: product()
				});
			}

			createDOM(visitedMarket);
			console.log(visitedMarket);
			return visitedMarket;
		};

		const getLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					position => {
						if ("coords" in position) {
							console.log("xxxxxxxxxxxxxxxxxxxxxx");
							setStorage(market, calculateVisits(position));
							setStorage("coords", position);
						} else {
							position = fetchStorage("coors", {});
							setStorage(market, calculateVisits(position));
						}
					},
					error => {
						console.log(error);
						setStorage(market, calculateVisits());
					}
				);
			}
		};
		getLocation();
	});
};
