import { fromEvent, from, Observable } from "../node_modules/rxjs/index";
import {
  debounceTime,
  map,
  filter,
  switchMap,
} from "../node_modules/rxjs/operators/index";
import { Shop } from "./shop";

const API_URL = "http://localhost:3000";

function getShopObservableByName(name: string): Observable<Shop[]> {
  console.log(`fetching a product with name: ${name}`);
  return from(
    fetch(`${API_URL}/shops/?name=${name}`)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("fetch error");
      })
      .catch((er) => console.log(er))
  );
}

function createShopSearchBoxByName() {
  const label = document.createElement("label");
  label.innerHTML = "Shop name ";
  document.body.appendChild(label);
  const input = document.createElement("input");
  document.body.appendChild(input);
  fromEvent(input, "input")
    .pipe(
      debounceTime(2000),
      map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
      filter((text) => text.length >= 3),
      switchMap((name) => getShopObservableByName(name)),
      map((shops) => shops[0])
    )
    .subscribe((shop) => showShop(shop));
}

function getShopObservableByLocation(value: string): Observable<Shop[]> {
  console.log(`fetching products with location: ${value}`);
  return from(
    fetch(`${API_URL}/shops/?location=${value}`)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("fetch location error");
      })
      .catch((err) => console.log(err))
  );
}

function createShopSearchBoxByLocation() {
  let label = document.createElement("label");
  label.innerHTML = "Location";
  document.body.appendChild(label);
  let input = document.createElement("input");
  document.body.appendChild(input);

  fromEvent(input, "input")
    .pipe(
      debounceTime(1000),
      map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
      switchMap((location) => getShopObservableByLocation(location))
    )
    .subscribe((shops) => showShops(shops));
}

function showShop(shop: Shop) {
  if (!shop) return;
  const div = document.createElement("div");
  div.innerHTML = `${shop.id}, ${shop.name}, ${shop.location}, ${shop.number_of_employees}`;
  document.body.appendChild(div);
}

function showShops(shops: Shop[]) {
  if (!shops) return;
  let div;
  shops.forEach((shop) => {
    showShop(shop);
  });
}

createShopSearchBoxByName();
createShopSearchBoxByLocation();
