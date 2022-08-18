let website_title = document.getElementById("title");
let website_url = document.getElementById("url");
let websites_table_body = document.getElementById("tbody");
let submit = document.getElementById("submit");
let invalid_message_p = document.getElementById("invalid-message");

let array_of_websites = [];

if (localStorage.getItem("websites") !== null) {
  array_of_websites = JSON.parse(localStorage.getItem("websites"));
  display_websites(array_of_websites);
}

function inputValidation(e) {
  let url_regexp = /^(https?:\/\/)?(www\.)?\w+\.(com|org|net)/;
  let title_regexp = /^[a-zA-Z0-9_]{3,}$/;
  let regexp = e.target == website_url ? url_regexp : title_regexp;
  if (regexp.test(e.target.value) == false) {
    if (e.target.classList.contains("is-valid")) {
      e.target.classList.remove("is-valid");
    }
    e.target.classList.add("is-invalid");
    fire_error_message();
    return false;
  } else {
    e.target.classList.replace("is-invalid", "is-valid");
    fire_error_message();
    return true;
  }
}

website_title.oninput = inputValidation;
website_url.oninput = inputValidation;

function validator() {
  let title_regexp = /^[a-zA-Z0-9_]{3,}$/;
  let url_regexp = /^(https?:\/\/)?(www\.)?\w+\.(com|org|net)/;
  if (
    title_regexp.test(website_title.value) &&
    url_regexp.test(website_url.value)
  ) {
    return true;
  } else {
    return false;
  }
}

submit.onclick = function (e) {
  e.preventDefault();
  if (validator() == true) {
    let website = {
      title: website_title.value,
      url:
        website_url.value.startsWith("http") == false
          ? (website_url.value = "https://" + website_url.value)
          : website_url.value,
    };
    array_of_websites.push(website);
    localStorage.setItem("websites", JSON.stringify(array_of_websites));
    display_websites(array_of_websites);
    resetInputs();
  } else {
    invalid_message_p.style.display = "block";
    invalid_message_p.innerText = "Check the Title and Url";
    fire_error_message();
  }
};

function resetInputs() {
  website_title.value = "";
  website_url.value = "";
  website_title.classList.remove("is-valid");
  website_url.classList.remove("is-valid");
  invalid_message_p.style.display = "none";
  document.documentElement.style.setProperty("--title-invalid-display", "none");
  document.documentElement.style.setProperty("--url-invalid-display", "none");
}

function display_websites(array_of_websites) {
  let tbody_container = "";
  for (let i = 0; i < array_of_websites.length; i++) {
    tbody_container += `<tr class="p-3">
                            <td class="fs-5">
                            ${array_of_websites[i].title}
                            </td>
                            <td>
                                <a class="btn btn-primary" href="${array_of_websites[i].url}" target="_blank">Visit</a>
                                <button class="btn btn-danger" id="deleteBtn" data-num="${i}" >Delete</button>
                            </td>
                        </tr>`;
  }
  websites_table_body.innerHTML = tbody_container;
}

document.addEventListener("click", function (e) {
  if (e.target.id === "deleteBtn") {
    let index = e.target.getAttribute("data-num");
    array_of_websites.splice(index, 1);
    localStorage.setItem("websites", JSON.stringify(array_of_websites));
    display_websites(array_of_websites);
  }
});

function fire_error_message() {
  if (website_title.classList.contains("is-invalid")) {
    document.documentElement.style.setProperty(
      "--title-invalid-display",
      "block"
    );
  }
  if (website_title.classList.contains("is-valid")) {
    document.documentElement.style.setProperty(
      "--title-invalid-display",
      "none"
    );
  }
  if (website_url.classList.contains("is-invalid")) {
    document.documentElement.style.setProperty(
      "--url-invalid-display",
      "block"
    );
  }
  if (website_url.classList.contains("is-valid")) {
    document.documentElement.style.setProperty("--url-invalid-display", "none");
  }
}
