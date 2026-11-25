import {
  Coffee, UtensilsCrossed, Pizza, Cake, Wine, IceCream, Soup,
  Sandwich, Cookie, CupSoda, Salad, Beef,
} from "lucide-react";


const BASE = [
  { Icon: Coffee, t: 7, l: 10, s: 62, r: 6 },
  { Icon: IceCream, t: 7, l: 31, s: 50, r: 10 },
  { Icon: Salad, t: 7, l: 51, s: 50, r: -16 },
  { Icon: Cake, t: 7, l: 67, s: 68, r: 22 },
  { Icon: Cookie, t: 8, l: 91, s: 62, r: 6 },
  { Icon: Pizza, t: 22, l: 11, s: 50, r: 17 },
  { Icon: Sandwich, t: 19, l: 30, s: 44, r: -20 },
  { Icon: Coffee, t: 20, l: 48, s: 44, r: 7 },
  { Icon: IceCream, t: 20, l: 71, s: 50, r: 11 },
  { Icon: Salad, t: 20, l: 88, s: 44, r: 20 },
  { Icon: Wine, t: 33, l: 11, s: 62, r: 13 },
  { Icon: CupSoda, t: 39, l: 33, s: 56, r: -2 },
  { Icon: Pizza, t: 37, l: 50, s: 44, r: -18 },
  { Icon: Sandwich, t: 36, l: 67, s: 44, r: -4 },
  { Icon: Coffee, t: 35, l: 94, s: 44, r: -9 },
  { Icon: Soup, t: 48, l: 13, s: 62, r: 2 },
  { Icon: Beef, t: 53, l: 29, s: 44, r: 14 },
  { Icon: Wine, t: 51, l: 52, s: 56, r: -1 },
  { Icon: CupSoda, t: 48, l: 69, s: 62, r: -15 },
  { Icon: Pizza, t: 48, l: 92, s: 44, r: -19 },
  { Icon: Cookie, t: 64, l: 10, s: 68, r: -10 },
  { Icon: UtensilsCrossed, t: 64, l: 28, s: 50, r: 4 },
  { Icon: Soup, t: 65, l: 47, s: 62, r: -9 },
  { Icon: Beef, t: 61, l: 73, s: 68, r: -3 },
  { Icon: Wine, t: 67, l: 86, s: 50, r: 3 },
  { Icon: Salad, t: 82, l: 11, s: 68, r: -16 },
  { Icon: Cake, t: 76, l: 27, s: 62, r: -6 },
  { Icon: Cookie, t: 76, l: 51, s: 56, r: 2 },
  { Icon: UtensilsCrossed, t: 76, l: 67, s: 68, r: 18 },
  { Icon: Soup, t: 77, l: 91, s: 56, r: 17 },
  { Icon: Coffee, t: 93, l: 14, s: 62, r: 14 },
  { Icon: IceCream, t: 91, l: 29, s: 50, r: -3 },
  { Icon: Salad, t: 95, l: 53, s: 50, r: -10 },
  { Icon: Cake, t: 91, l: 71, s: 68, r: -10 },
  { Icon: Cookie, t: 94, l: 89, s: 62, r: 16 },
];

const WIDE = [
  { Icon: Cake, t: 5, l: 2, s: 52, r: -20 },
  { Icon: Cookie, t: 8, l: 14, s: 76, r: -6 },
  { Icon: UtensilsCrossed, t: 8, l: 27, s: 76, r: -4 },
  { Icon: Soup, t: 8, l: 38, s: 52, r: -14 },
  { Icon: Beef, t: 6, l: 45, s: 84, r: 17 },
  { Icon: Wine, t: 5, l: 53, s: 60, r: -21 },
  { Icon: CupSoda, t: 5, l: 64, s: 60, r: -19 },
  { Icon: Pizza, t: 5, l: 74, s: 84, r: 14 },
  { Icon: Sandwich, t: 12, l: 83, s: 60, r: 6 },
  { Icon: Coffee, t: 12, l: 96, s: 84, r: 15 },
  { Icon: Soup, t: 29, l: 6, s: 52, r: 8 },
  { Icon: Beef, t: 28, l: 16, s: 52, r: -21 },
  { Icon: Wine, t: 26, l: 22, s: 52, r: -3 },
  { Icon: CupSoda, t: 24, l: 38, s: 52, r: 6 },
  { Icon: Pizza, t: 25, l: 46, s: 60, r: -1 },
  { Icon: Sandwich, t: 24, l: 56, s: 52, r: 4 },
  { Icon: Coffee, t: 29, l: 62, s: 76, r: 14 },
  { Icon: IceCream, t: 21, l: 76, s: 76, r: 15 },
  { Icon: Salad, t: 21, l: 82, s: 52, r: 18 },
  { Icon: Cake, t: 22, l: 94, s: 76, r: -1 },
  { Icon: CupSoda, t: 41, l: 6, s: 84, r: 7 },
  { Icon: Pizza, t: 41, l: 17, s: 52, r: 11 },
  { Icon: Sandwich, t: 44, l: 22, s: 84, r: -17 },
  { Icon: Coffee, t: 42, l: 33, s: 52, r: 9 },
  { Icon: IceCream, t: 44, l: 46, s: 76, r: -6 },
  { Icon: Salad, t: 45, l: 54, s: 60, r: 21 },
  { Icon: Cake, t: 43, l: 65, s: 68, r: 20 },
  { Icon: Cookie, t: 45, l: 75, s: 60, r: -2 },
  { Icon: UtensilsCrossed, t: 41, l: 84, s: 76, r: -10 },
  { Icon: Soup, t: 45, l: 94, s: 84, r: -2 },
  { Icon: Coffee, t: 56, l: 3, s: 68, r: -20 },
  { Icon: IceCream, t: 60, l: 18, s: 68, r: -12 },
  { Icon: Salad, t: 55, l: 25, s: 60, r: 4 },
  { Icon: Cake, t: 57, l: 35, s: 68, r: 17 },
  { Icon: Cookie, t: 58, l: 42, s: 52, r: -5 },
  { Icon: UtensilsCrossed, t: 61, l: 52, s: 68, r: 14 },
  { Icon: Soup, t: 57, l: 66, s: 84, r: -21 },
  { Icon: Beef, t: 59, l: 74, s: 60, r: -21 },
  { Icon: Wine, t: 60, l: 84, s: 60, r: -19 },
  { Icon: CupSoda, t: 62, l: 93, s: 52, r: 18 },
  { Icon: Cake, t: 75, l: 6, s: 68, r: -18 },
  { Icon: Cookie, t: 76, l: 13, s: 76, r: -6 },
  { Icon: UtensilsCrossed, t: 72, l: 22, s: 76, r: 12 },
  { Icon: Soup, t: 77, l: 33, s: 68, r: 0 },
  { Icon: Beef, t: 75, l: 48, s: 84, r: 17 },
  { Icon: Wine, t: 79, l: 53, s: 60, r: -17 },
  { Icon: CupSoda, t: 74, l: 67, s: 76, r: -14 },
  { Icon: Pizza, t: 75, l: 73, s: 52, r: 2 },
  { Icon: Sandwich, t: 75, l: 86, s: 84, r: -1 },
  { Icon: Coffee, t: 75, l: 96, s: 60, r: -16 },
  { Icon: Soup, t: 93, l: 7, s: 52, r: -9 },
  { Icon: Beef, t: 90, l: 14, s: 52, r: -3 },
  { Icon: Wine, t: 92, l: 27, s: 68, r: -6 },
  { Icon: CupSoda, t: 95, l: 37, s: 68, r: 10 },
  { Icon: Pizza, t: 88, l: 45, s: 84, r: 4 },
  { Icon: Sandwich, t: 94, l: 55, s: 52, r: -9 },
  { Icon: Coffee, t: 94, l: 62, s: 52, r: -11 },
  { Icon: IceCream, t: 92, l: 76, s: 60, r: 8 },
  { Icon: Salad, t: 89, l: 85, s: 84, r: 21 },
  { Icon: Cake, t: 93, l: 98, s: 76, r: 15 },
];

type Item = (typeof BASE)[number];

function Icons({ items }: { items: Item[] }) {
  return (
    <>
      {items.map(({ Icon, t, l, s, r }, i) => (
        <Icon
          key={i}
          size={`clamp(${Math.round(s * 0.65)}px, ${s / 10}vw, ${Math.round(s * 1.15)}px)`}
          strokeWidth={1.1}
          className="absolute text-[#C9A640]/25"
          style={{ top: `${t}%`, left: `${l}%`, transform: `translate(-50%,-50%) rotate(${r}deg)` }}
        />
      ))}
    </>
  );
}

export function FoodBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="food-in absolute inset-0 lg:hidden">
        <Icons items={BASE} />
      </div>
      <div className="food-in absolute inset-0 hidden lg:block">
        <Icons items={WIDE} />
      </div>
    </div>
  );
}
