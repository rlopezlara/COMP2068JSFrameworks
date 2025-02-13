
// JS code to include typing effect on the home page, brief comments about myself
const text = " Hello There! I have over seven years of experience in the banking industry and a strong passion for continuous learning and professional growth. I pursued a diploma in computer programming to complement my background, equipping myself with the technical skills needed to optimize processes and drive innovation within an organization. ";
const typingSpeed = 50; // Speed in milliseconds
let index = 0;

// Function to create typing effect
function typeEffect() {
    if (index < text.length) {
        document.getElementById("typing-text").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, typingSpeed);
    }
}

// Start typing effect when page loads
window.onload = typeEffect;