import photoMoons from "@/assets/photo-moons.jpg";
import photoFlowers from "@/assets/photo-flowers.jpg";
import photoHearts from "@/assets/photo-hearts.jpg";
import photoSunglasses from "@/assets/photo-sunglasses.jpg";
import photoPinkHearts from "@/assets/photo-pink-hearts.jpg";

export const birthdayData = {
  sisterName: "Di",
  birthdayDate: "A day made brighter by you",
  videoUrl: "/d.mp4" as string | null,
  musicUrl: "/music.mp3" as string | null,
  balloonCount: 15,
  candleCount: 6,
  photos: [
    { src: photoMoons, title: "Celestial Souls", date: "Under the moon's magic", message: "We shine brightest when we're together, like stars in the night sky." },
    { src: photoFlowers, title: "Flower Crowns", date: "Just being ourselves", message: "The best memories are made when we can just be our authentic selves together." },
    { src: photoHearts, title: "Hearts Aligned", date: "A cherished memory", message: "Our bond is unbreakable, filled with endless love and beautiful moments." },
    { src: photoSunglasses, title: "Cool Moments", date: "Forever iconic", message: "Too cool for anything — and I wouldn't have it any other way." },
    { src: photoPinkHearts, title: "Love & Laughter", date: "Forever sisters", message: "Through every season, every challenge, every celebration - always together." },
  ],
  wishes: [
    "May your smile always shine brighter than the stars.",
    "May every dream you have find its way to you.",
    "May your life always be filled with beautiful memories.",
    "May happiness follow you everywhere.",
    "May you always stay as wonderful as you are.",
    "May this birthday begin your most magical year yet.",
  ],
  balloonMessages: ["You are magic!", "Keep shining!", "So loved!", "Dream big!", "Pure joy!"],
  chronicle: "You are not just my sister,\nyou are one of the most important\npeople in my life.\n\nThank you for every laugh,\nevery memory, and every moment.",
  finalMessage: "Through every season and every constellation, your love has been a light I could always find. May this year return to you all the joy, courage, laughter, and wonder you so freely give. I am forever grateful that life gave me you, Di.",
  musicLabel: "Add your favorite song in data.ts",
};
