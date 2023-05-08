import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

    static targets = ["comment"]

    counter = 0;
    connect() {
        const url = window.location.href;
        if (url.includes("#")) {
            const comment = url.substring(url.lastIndexOf("_") + 1)

            const target = document.querySelector(url.substring(url.indexOf("#")));
            const items = this.commentTargets.find((items) => {
                if (items.dataset.commentId >= comment && items.querySelector("li").classList.contains("hidden")) {
                    items.querySelector("li").classList.remove("hidden")
                }
            })

            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY,
                left: 0,
                behavior: "smooth",
            });
        }
        const hiddenComments = this.commentTargets.filter((comment) => comment.querySelector("li").classList.contains("hidden"))
        if (hiddenComments.length > 1) {
            document.getElementById("load-comments").style.display = "block"
        } else {
            document.getElementById("load-comments").style.display = "none"
        }

    }
    toggleComments(event) {
        event.preventDefault()
        const hiddenComments = this.commentTargets.filter((comment) => comment.querySelector("li").classList.contains("hidden"))
        this.counter = 0
        hiddenComments.reverse().forEach((comments, index) => {
            if (index < this.counter + 10) {
                comments.querySelector("li").classList.remove("hidden")
            }
            else {
                return
            }
        });
        if (this.commentTargets.filter((comment) => comment.querySelector("li").classList.contains("hidden")).length < 1) {
            document.getElementById("load-comments").style.display = "none"
        }
    }
}