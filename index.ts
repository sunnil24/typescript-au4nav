// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

class Shop {
  private name: string;
  readonly openTime: string;

  constructor(name: string, openAt: string) {
    this.name = name;
    this.openTime = openAt;
  }

  open() {
    console.log(`this shop opens at ${this.openTime}`);
  }
}

const medicalShop = new Shop('Apollo', '8:30 AM');

console.log(medicalShop);
medicalShop.open();
