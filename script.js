// Show message
function showMessage() {
  alert("Good Luck Cooking!");
}

// Toggle step completion
function toggleStep() {
  const steps = document.querySelectorAll("#steps li");
  for (let step of steps) {
    step.addEventListener("click", function () {
      this.classList.toggle("done");
    });
  }
}

// Add "done" style dynamically
const style = document.createElement("style");
style.innerHTML = `
  .done {
    text-decoration: line-through;
    color: gray;
  }
`;
document.head.appendChild(style);

// Form validation
document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields!");
    return;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    alert("Please enter a valid email address!");
    return;
  }

  alert("Form submitted successfully!");
  this.reset();
});
