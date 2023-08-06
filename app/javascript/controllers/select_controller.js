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
    const folderId = this.selectTarget.value;
    const authenticityToken = document.querySelector(
      'meta[name="csrf-token"]'
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
          const notice = response.notice;
          window.location.href =
            "/spaces/" + this.spaceIdValue + "/folders/" + folderId;
        } else {
          console.error("An error occurred during the POST request.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
