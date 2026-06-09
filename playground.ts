const retries: number = 5;  // What does VS Code show?
const user = { email: "john@test.com" };
console.log(user.email);      // What does VS Code show?

function getTimeout(seconds: number): number {
  return seconds * 1000;  // Hint: look at the return type
}

const config = { baseURL: "https://staging.example.com" };
console.log(config.baseURL);  // Hint: case matters

function printName(name: string | undefined) {
  if (name === undefined) {
    console.log("<anonymous>");
    return;
  }
  console.log(name);
}
const userName: string | undefined = undefined;
printName(userName);  // Hint: what if userName is undefined?

type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const book: Product = {
  name: "One Hundred Years of Solitude",
  price: 19.99,
  inStock: true,
};

const bag: Product = {
  name: "Leather Backpack",
  price: 199.99,
  inStock: false,
};

function formatPrice(price: number): string {
  return `$${price}`;
}

// Usage
console.log(formatPrice(9.99));    // "$9.99"
console.log(formatPrice(1999.99)); // "$1999.99"