const API = "http://localhost:5000/students";

document.addEventListener("DOMContentLoaded", loadStudents);

function loadStudents() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("data");
      tbody.innerHTML = "";

      data.forEach(s => {
        tbody.innerHTML += `
          <tr>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.course}</td>
            <td>
              <button onclick="deleteStudent(${s.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => console.log(err));
}

function addStudent() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;

  if (!name || !email || !course) {
    alert("All fields are required");
    return;
  }

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, course })
  })
    .then(() => {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("course").value = "";
      loadStudents();
    });
}

function deleteStudent(id) {
  fetch(`${API}/${id}`, { method: "DELETE" })
    .then(() => loadStudents());
}
