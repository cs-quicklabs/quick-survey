import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  copyUrl(event) {
    event.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    event.target.innerHTML = "Copied to Clipboard!";
  }
}
