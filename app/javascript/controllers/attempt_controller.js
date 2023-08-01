import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["attempt"];

  checked(event) {
    event.preventDefault();

        

        const url = "/answer?question_id=" + event.target.dataset.questionId + "&option_id=" + event.target.dataset.optionId + "&attempt_id=" + event.target.dataset.attemptId;
        fetch(url, { headers: { Accept: "text/vnd.turbo-stream.html" } })
        .then((response) => response.text())
        .then((html) => {           
            this.attemptTarget.innerHTML = html;
        });
    }
}
