let registerForm = document.querySelector("#Register form"),
  registerInputs = registerForm.querySelectorAll("input"),
  students = [],
  id = 0,
  tableBody = document.querySelector("#Data tbody"),
  regex = {
    FirstName: /^[A-Za-z]+$/gm,
    LastName: /^[A-Za-z]+$/,
    Email: /^[A-Za-z_][A-Za-z_0-9\.]*@(gmail|yahoo)\.(com|org)$/,
    Age: /^[0-9]{2}$/,
    Phone: /^(02)?01(0|1|2|5)[0-9]{8}$/,
  },
  searchInput = document.querySelector("#SearchInput");

if (localStorage.getItem("students") === null) {
  updateLocalStorage();
} else {
  students = JSON.parse(localStorage.getItem("students"));
  id = students[students.length - 1]?.id ?? 0;
  showAllStudents(students);
}

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let formType = registerForm.dataset.type;

  if (formType == "add") {
    addStudent();
  } else if (formType == "edit") {
    editStudent();
  }
});

searchInput.addEventListener("keyup", function () {
  search(this.value);
});
