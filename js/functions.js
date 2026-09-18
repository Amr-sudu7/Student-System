function getStudent(id) {
  let student = { id: id };
  registerInputs.forEach(function (item) {
    let key = item.name,
      value = item.value;
    student[key] = value;
  });
  return student;
}

function addStudent() {
  let focusInput = registerForm.querySelector("input:focus"),
    invalidDataInput = registerForm.querySelector('input[data-valid="false"]');
  focusInput?.blur();
  let invalidInput = registerForm.querySelector("input.is-invalid");

  if (invalidInput !== null || invalidDataInput !== null) {
    return;
  }
  let student = getStudent(++id);
  students.push(student);
  updateLocalStorage();
  noDataFound(students);
  showStudent(student);
  resetForm();
}

function showStudent(student) {
  tableBody.innerHTML += `
  <tr data-student-id="${student.id}">
   <td>${student.id}</td>
   <td>${student.FirstName}</td>
   <td>${student.LastName}</td>
   <td>${student.Email}</td>
   <td>${student.Age}</td>
   <td>${student.Phone}</td>
   <td>
   <button class="btn btn-info text-light me-2" onclick="insertStudentInForm(${student.id})">Edit</button>
   <button class="btn btn-danger" onclick="DeleteStudent(${student.id}, this)">Delete</button>
   </td>
  </tr>
   `;
}

function checkInput(input) {
  let inputName = input.name,
    inputValue = input.value,
    isEmpty = inputValue === "",
    errorElement = document.querySelector(`p.alert[data-error-name="${inputName}"]`),
    isInValid = !regex[inputName].test(inputValue),
    errorMsg = "";

  if (isEmpty) {
    errorMsg = "This Field is Required.";
  } else if (isInValid) {
    errorMsg = "This Field Is Invalid";
  }

  if (isEmpty || isInValid) {
    input.classList.add("is-invalid");
    errorElement.classList.remove("d-none");
    input.classList.remove("is-valid");
    errorElement.textContent = errorMsg;
    input.dataset.valid = false;
  } else {
    input.classList.remove("is-invalid");
    errorElement.classList.add("d-none");
    input.classList.add("is-valid");
    input.dataset.valid = true;
  }
}

function resetForm() {
  registerForm.reset();

  registerInputs.forEach(function (input) {
    document.querySelector(`p.alert[data-error-name="${input.name}"]`).classList.add("d-none");
    input.classList.remove("is-valid");
    input.classList.remove("is-invalid");
  });

  registerForm.setAttribute("data-type", "add");
  btn = registerForm.querySelector("button");
  btn.classList.remove("btn-info");
  btn.classList.add("btn-success");
  btn.textContent = "Add";
}

function updateLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function showAllStudents(data) {
  tableBody.innerHTML = `
  <tr>
    <td id="TableAlert" class="table-warning text-center" colspan="7"> There is no data </td>
  </tr>
  `;
  data.forEach(function (student) {
    showStudent(student);
  });

  noDataFound(data);
}

function getStudentIndex(id) {
  return students.findIndex((student) => student.id == id);
}

function DeleteStudent(id, that) {
  if (!confirm("are you sure")) {
    return;
  }
  let deletedStudentIndex = getStudentIndex(id),
    trElement = that.closest("tr");
  trElement.remove();
  students.splice(deletedStudentIndex, 1);
  updateLocalStorage();
  noDataFound(students);
}

function noDataFound(data) {
  let TableAlert = document.querySelector("#TableAlert");
  if (data.length == 0) {
    TableAlert.classList.remove("d-none");
  } else {
    TableAlert.classList.add("d-none");
  }
}

function insertStudentInForm(id) {
  resetForm();
  let editStudent = students.find(function (student) {
      return student.id == id;
    }),
    formBtn = registerForm.querySelector("button");
  registerInputs.forEach(function (input) {
    input.value = editStudent[input.name];
  });
  formBtn.textContent = "Edit";
  formBtn.classList.remove("btn-success");
  formBtn.classList.add("btn-info", "text-light");
  registerForm.setAttribute("data-type", "edit");
  registerForm.setAttribute("data-student-id", id);

  toggleStudentButtons();
}

function editStudent() {
  let studentId = registerForm.dataset.studentId,
    student = getStudent(studentId),
    studentIndex = getStudentIndex(studentId),
    trElement = tableBody.querySelector(`tr[data-student-id="${studentId}"]`);

  trElement.innerHTML = `
    <td>${student.id}</td>
   <td>${student.FirstName}</td>
   <td>${student.LastName}</td>
   <td>${student.Email}</td>
   <td>${student.Age}</td>
   <td>${student.Phone}</td>
   <td>
   <button class="btn btn-info text-light me-2" onclick="insertStudentInForm(${student.id})">Edit</button>
   <button class="btn btn-danger" onclick="DeleteStudent(${student.id}, this)">Delete</button>
   </td>
    `;

  students[studentIndex] = student;
  updateLocalStorage();
  resetForm();
}

function search(searchValue) {
  let filteredStudent = students.filter(function (student) {
    return student.FirstName.toLowerCase().includes(searchValue.toLowerCase()) || student.LastName.toLowerCase().includes(searchValue.toLowerCase()) || student.Email.toLowerCase().includes(searchValue.toLowerCase()) || student.Age.toLowerCase().includes(searchValue.toLowerCase()) || student.Phone.toLowerCase().includes(searchValue.toLowerCase());
  });
  showAllStudents(filteredStudent);
}

function toggleStudentButtons() {
  let rows = tableBody.querySelectorAll("tr[data-student-id]");

  rows.forEach(function (row) {
    let editButton = row.querySelector(".btn-info");
    let deleteButton = row.querySelector(".btn-danger");

    let isCurrentStudent = row.dataset.studentId == registerForm.dataset.studentId;
    console.log(isCurrentStudent);
    if (registerForm.dataset.type === "edit" && isCurrentStudent) {
      editButton.disabled = true;
      deleteButton.disabled = true;
    } else {
      editButton.disabled = false;
      deleteButton.disabled = false;
    }
  });
}
