import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu", "submenu", "nestedDropdown"];

  connect() {
    this.menuTarget.classList.add("hidden");
  }

  toggle() {
    this.menuTarget.classList.toggle("hidden");
  }

  close() {
    this.menuTarget.classList.add("hidden");
  }

  generateSubmenu(event) {
    //this.submenuTarget.classList.toggle('hidden');
    const url =
      "/space_folders?survey_id=" + event.target.closest("li").dataset.surveyId;

    fetch(url, { headers: { Accept: "text/vnd.turbo-stream.html" } })
      .then((response) => response.text())
      .then((html) => {
        this.submenuTarget.innerHTML = html;
        const submenuDivs = this.submenuTarget.querySelectorAll("li > div");
        submenuDivs.forEach((div) => {
          div.classList.add("hidden");
        });
        event.stopPropagation();
      });
  }

  generateNestedDropdown(event) {
    //this.submenuTarget.classList.toggle('hidden');
    const url = "/folders/" + event.target.closest("li").dataset.spaceIdValue;
    fetch(url, { headers: { Accept: "text/vnd.turbo-stream.html" } })
      .then((response) => response.text())
      .then((html) => {
        if (this.nestedDropdownTargets.length > 0) {
          this.nestedDropdownTargets
            .find(
              (element) =>
                element.dataset.spaceId ==
                event.target.closest("li").dataset.spaceIdValue,
            )
            .classList.toggle("hidden");

          event.stopPropagation();
        }
      });
  }
}
