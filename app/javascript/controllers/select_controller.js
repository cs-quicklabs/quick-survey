import { Controller } from "@hotwired/stimulus";
import { get } from "@rails/request.js";

export default class extends Controller {
  static targets = ["select"];
  static values = {
    url: String,
    param: String,
    spaceId: String,
  };

  connect() {
    if (this.selectTarget.id === "") {
      this.selectTarget.id = Math.random().toString(36).substring(7);
    }
  }

  change(event) {
    let params = new URLSearchParams();

    const spaceId = event.target.selectedOptions[0].value;

    get(`${this.urlValue}&space=${spaceId}`, {
      responseKind: "turbo-stream",
    })
      .then((response) => response.text)
      .then((html) => {
        this.selectTarget.innerHTML = html;
      });
  }

  submit(event) {
    event.preventDefault();
    const url = event.target.closest("form").action;
    if (this.selectTarget.value === "") {
      return;
    }
    const folderId = this.selectTarget.value;
    const authenticityToken = document.querySelector(
      'meta[name="csrf-token"]',
    ).content;
    const requestBody = JSON.stringify({
      folder_id: folderId,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": authenticityToken,
      },
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          // Handle the redirect based on the response or redirect to a default URL
          return response.json();
        } else {
          console.error("An error occurred during the POST request.");
          const location = response.headers.get("Location");
          window.location.href = location;
        }
      })
      .then((data) => {
        if (data.location) {
          window.location.href = data.location;
        } else {
          const location = response.headers.get("Location");
          window.location.href = location;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
