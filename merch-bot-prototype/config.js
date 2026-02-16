const path = require('path');

module.exports = {
    // Path to your design file (use double backslashes for Windows paths, e.g., "C:\\Users\\mehme\\Desktop\\design.png")
    imagePath: path.join(__dirname, 'example-design.png'),

    // Design Details
    title: "Vintage Retro Sunset Cat Lover T-Shirt",
    brand: "MeowRetro Designs",

    // Bullets (Key Features)
    bullet1: "Features a cool vintage retro sunset style with a silhouette of a cat. Perfect for cat moms, cat dads, and anyone who loves feline friends.",
    bullet2: "Great gift idea for birthdays, Christmas, or any special occasion. Wear this to show off your love for cats and retro aesthetics.",

    // Description (appears below bullets on Amazon)
    description: "This unique design combines a classic retro sunset look with a cute cat silhouette. It's designed for comfort and style, making it a perfect addition to any wardrobe. Available in multiple colors and sizes for men, women, and youth.",

    // Product Configuration
    marketplace: "com", // 'com', 'co.uk', 'de' etc. (Future implementation)
    colors: ["Black", "Navy", "Dark Heather", "Heather Grey"], // Colors to select
    price: "19.99", // List price
};
