import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["attempt"];

  checked(event) {
    event.preventDefault();

    const url =
    "/"+event.target.dataset.accountId+ "/answer/"+ event.target.dataset.attemptId+"?question_id=" +
      event.target.dataset.questionId +
      "&option_id=" +
      event.target.dataset.optionId
    fetch(url, { headers: { Accept: "text/vnd.turbo-stream.html" } })
      .then((response) => response.text())
      .then((html) => {
        this.attemptTarget.innerHTML = html;
      });
  }
  scored(event)
  {
  event.preventDefault();

  const url = "/"+
  event.target.dataset.accountId+
    "/score/"+ event.target.dataset.attemptId+"?question_id=" +
    event.target.dataset.questionId +
    "&option_id=" +
    event.target.dataset.optionId+
    "&score=" +
    event.target.dataset.score
  fetch(url, { headers: { Accept: "text/vnd.turbo-stream.html" } })
    .then((response) => response.text())
    .then((html) => {
      this.attemptTarget.innerHTML = html;
    });
}
}
