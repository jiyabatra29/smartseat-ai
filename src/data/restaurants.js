import mcd from "../assets/mcd.jpg";
import kfc from "../assets/kfc.jpg";
import burger from "../assets/burgerking.jpg";

const restaurants = [
  {
    id: 1,
    name: "McDonald's",
    image: mcd,
    rating: 4.3,
    crowd: "Low",
    waitTime: "5 mins",
    address: "Connaught Place, New Delhi",
  },
  {
    id: 2,
    name: "KFC",
    image: kfc,
    rating: 4.1,
    crowd: "High",
    waitTime: "20 mins",
    address: "Rajouri Garden, New Delhi",
  },
  {
    id: 3,
    name: "Burger King",
    image: burger,
    rating: 4.2,
    crowd: "Medium",
    waitTime: "10 mins",
    address: "Saket, New Delhi",
  },
];

export default restaurants;