const editBtn = document.getElementById("edit-btn");
const fileUpload = document.getElementById("new-avatar");

editBtn.addEventListener("click", () => {
  fileUpload.click();
});


document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("profile-password");
  const editIcon = document.getElementById("edit-password-icon");

  editIcon.addEventListener("click", () => {
    const isDisabled = passwordInput.disabled;
    passwordInput.disabled = !isDisabled;

    if (isDisabled) {
      editIcon.style.color = "#858585";
      passwordInput.focus();
    } else {
      editIcon.style.color = "#aaa";
    }
  });
});
