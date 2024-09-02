//Global records variable i.e. total numbers of recors that we do have.
let records = getData();
//converting string to json from the localstorage.
records ? (records = JSON.parse(records)) : (records = []);
//return total records in the localstorage.
function getData() {
  return localStorage.getItem("data");
}
//handling form submit.
function submitForm(event) {
  //preventing default execution on the form to go to the action location.
  event.preventDefault();
  const form = document.getElementById("std_form");
  //FormData a web API for collecting from data.
  const formData = new FormData(form);
  //creating data_obj for making an obj of the entered values in the form i.e creating an obj of form data.
  let data_obj = {};
  let insert = "create";
  // Iterate through form data and log entries
  for (const [key, value] of formData.entries()) {
    /*adding key value pair in data_obj
    but first check if the value for the key std_id already exists with any of the records as it should be unique.*/
    if (
      records.find((record) => key == "std_id" && record.std_id == value) &&
      document.querySelector("#submit").value == "Create"
    ) {
      //a variable to check status of insert
      insert = "exists";
      //if we create a record with user id that already exists the loop must termianated
      break;
    } else if (
      /*if the student id entered in the form is equal to any of the student id in the records update the record of that student id and
    that too when the button says update.*/
      records.find(
        (record) => record.std_id == document.getElementById("std_id").value
      ) &&
      document.querySelector("#submit").value == "Update"
    ) {
      //if the student id already exists then update the record.
      insert = "update";
      records.map((record) => {
        if (record.std_id == document.getElementById("std_id").value) {
          record[key] = value;
        }
      });
    } else if (
      //if no such user found to update with respect to the student id then then record not existed
      records.find(
        (record) => record.std_id !== document.getElementById("std_id").value
      ) &&
      document.querySelector("#submit").value == "Update"
    ) {
      insert = "no data";
      //termainate the loop if no record found to update.
      break;
    } else {
      //insert the values of the form in a object as key value pairs
      data_obj[key] = value;
    }
  }
  if (insert == "create") {
    //push the form data created as object in the total existing records.
    records.push(data_obj);
    //save the new total records in the localstorage
    localStorage.setItem("data", JSON.stringify(records));
    alert("Data inserted successfully");
    location.reload();
  } else if (insert == "update") {
    localStorage.setItem("data", JSON.stringify(records));
    alert("Data updated successfully");
    location.reload();
  } else if (insert == "no data") {
    alert("Data not found");
  } else {
    alert("User already exists");
  }
}

//call display rercords as soon as it div for added students load.
document
  .querySelector(".added_students")
  .addEventListener("DOMContentLoaded", displayRecords());

function displayRecords() {
  /*if existing records has some length that is stored in the localstorage then printing that data i.e in the localstorage
  by creating elements of a table and presenting it in a tabular form i have alreay created the start of the table mainly its th part
  that will be visible only when there is some data in the localstorage now i just need to append new tr and td elemnets to the table
  with the content inside td form the localstorage that i have stored in the records variable.*/
  if (records.length) {
    const tableElement = document.querySelector("table");
    tableElement.style.display = "block";
    for (let rec of records) {
      let trElement = document.createElement("tr");
      for (const key in rec) {
        const tdElement = document.createElement("td");
        tdElement.textContent = rec[key];
        trElement.appendChild(tdElement);
      }
      //adding delete and edit button along with event listners to handle delete and edit records.
      const btn_d = document.createElement("button");
      const btn_e = document.createElement("button");
      btn_d.textContent = "Delete";
      btn_d.id = "del";
      btn_d.classList.add("btn");
      btn_d.addEventListener("click", del_record);
      btn_e.textContent = "Edit";
      btn_e.addEventListener("click", edit_record);
      btn_e.id = "edit";
      btn_e.classList.add("btn");
      const tdElement = document.createElement("td");
      tdElement.classList.add("action");
      tdElement.appendChild(btn_d);
      tdElement.appendChild(btn_e);
      trElement.appendChild(tdElement);
      //inserting the latest insertion at the top
      tableElement.insertBefore(
        trElement,
        tableElement.firstElementChild.nextSibling
      );
    }
  } else {
    document.querySelector("table").style.display = "none";
    document.querySelector(".added_students").innerHTML = "No record found.";
  }
}
function del_record(event) {
  //taking the confirmation if the user really wants to delete the record.
  let confirmation = confirm("Are you sure you want to delete the record?");
  if (confirmation) {
    const del_rec =
      event.target.parentNode.parentNode.firstElementChild.innerHTML;
    /*taking out the id of the student form the table when delete clicked and then using that id to filter than the records other than
    that student id and making it as the new existing records this would delte the required student record.*/
    let new_records = records.filter((rec) => rec.std_id !== del_rec);
    localStorage.setItem("data", JSON.stringify(new_records));
    alert("Record deleted successfully");
    location.reload();
  }
}
function edit_record(event) {
  let edit_rec = event.target.parentNode.parentNode.firstElementChild.innerHTML;
  //edit record array the record that needed to be edited.
  let edit_rec_arr = records.filter((rec) => rec.std_id === edit_rec);
  /* the value of the student id from the table that too will be got after we trigger the event
  pf clicking edit button that would give us only the id of that particular row then i took the student i from there used it get the
  existing data of that student id from the existing records and put it in the form so that we dont need to manually enter each detail
  and make only neccessary changes.*/
  document.getElementById("name").value = edit_rec_arr[0].name;
  document.getElementById("email").value = edit_rec_arr[0].email;
  document.getElementById("std_id").value = edit_rec_arr[0].std_id;
  document.getElementById("contact").value = edit_rec_arr[0].contact;
  /*when we click on edit the edit the value of the submit button will change from create to update.
  NOTE : TO AGAIN CREATE A RECORD IF YOYU ARE IN THE STAGE OF UPDATING THE RECORD YOU WILL NEED TO REFRESH THE PAGE
  AND FILL ALL THE DETIAL IN THE FORM FROM THE SCRATCH.*/
  const sub_btn = document.querySelector("#submit");
  sub_btn.value = "Update";
  sub_btn.style = "background:black;color:white";
}
