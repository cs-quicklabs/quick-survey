// app/javascript/controllers/hide-element_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    setTimeout(() => {
      this.element.style.display = "none";
    }, 2000); // Hides the element after 2 seconds
  }
}
