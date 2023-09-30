import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  scroll(event) {
    event.preventDefault();
    const target = document.querySelector(
      event.currentTarget.dataset.scrollToTarget,
    );
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition,
      left: 0,
      behavior: "smooth",
    });
  }
}
