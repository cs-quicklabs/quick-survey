import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  toggle(event) {
    const TARGETS = event.currentTarget.dataset.toggleTarget.split(",");
    const HIDDEN_CLASS = "hidden";
    TARGETS.forEach((target) =>
      document
        .querySelectorAll(`[data-toggle-name="${target}"]`)
        .forEach((target) => target.classList.remove(HIDDEN_CLASS)),
    );
    event.currentTarget.classList.toggle("hidden");
  }
  hide(event) {
    const TARGETS = event.currentTarget.dataset.toggleTarget.split(",");
    const HIDDEN_CLASS = "hidden";

    TARGETS.forEach((target) =>
      document
        .querySelectorAll(`[data-toggle-name="${target}"]`)
        .forEach((target) => target.classList.add(HIDDEN_CLASS)),
    );
    document
      .querySelector(`[data-action="click->toggle#toggle"]`)
      .classList.remove(HIDDEN_CLASS);
  }
}
