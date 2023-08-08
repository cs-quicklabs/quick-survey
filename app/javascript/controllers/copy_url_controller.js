import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  copyUrl(event) {
    event.preventDefault();
    const url = event.target.href;
    navigator.clipboard.writeText(url);
    event.target.innerHTML = "Copied to Clipboard!";
  }
}
