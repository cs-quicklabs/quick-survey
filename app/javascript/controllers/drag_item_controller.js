import { Controller } from "@hotwired/stimulus";
import { list } from "postcss";

export default class extends Controller {
  static values = {
    questionId: Number,
  };

  connect() {
    console.log("connected");
    let elms = document.querySelectorAll(".field-preview");
    // assign a custom data-id to each element
    // this is only for use in the codepen because this is in place
    // within the actual generation of the divs
    let sort = this;
    elms.forEach(function (elm) {
      elm.dataset.id = sort.uniqueID();
    });

    this.grabbedElm = null;
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // PEN ONLY
  uniqueID() {
    return window.performance.now().toString().replace(".", "");
  }

  // PEN ONLY
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  // dragstart event
  // -----------------------------
  dragstart(event) {
    event.dataTransfer.setData("dataID", event.target.dataset.id);
    this.questionId = event.target.closest("li").dataset.questionId;
    event.target.classList.add("dragging");
    event.target.dataset.startingPosition =
      event.target.closest("li").dataset.index;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", null);
    this.grabbedElm = event.target;
  }

  sibling(elm1, elm2) {
    if (elm1.parentNode === elm2.parentNode) {
      return true;
    } else {
      return false;
    }
  }

  // dragover event
  // ------------------------------
  dragover(event) {
    event.preventDefault();
    let dragOverElm = event.target;

    let elm = this.grabbedElm;

    // Check if the dragged element is different from the drop target
    if (elm !== dragOverElm) {
      if (this.sibling(elm, dragOverElm)) {
        if (this.getIndexOfElm(elm) < this.getIndexOfElm(dragOverElm)) {
          event.target.parentNode.insertBefore(elm, dragOverElm.nextSibling);
        } else {
          event.target.parentNode.insertBefore(elm, dragOverElm);
        }
      }
    }
  }

  //       let bounding = event.target.getBoundingClientRect();
  //       let offset = bounding.y + (bounding.height/2);
  //       let currentPosition = this.getIndexOfElm(event.target);
  //       let dragElm = document.querySelector('.dragging');

  //       if ( event.clientY - offset > 0 ) {
  //         event.target.style['border-bottom'] = 'solid 4px blue';
  //         currentPosition = currentPosition + 1;
  //       } else {
  //         event.target.style['border-top'] = 'solid 4px blue';
  //         event.target.style['border-bottom'] = '';
  //       }

  //       dragElm.dataset.currentPosition = currentPosition;
  //       event.preventDefault();

  // drag
  // -----------------------------
  drag(event) {
    event.preventDefault();
    // this.logging(event);
  }

  // drop event
  // -----------------------------
  drop(event) {
    let container = event.target.closest("ol");
    const newPosition = event.target.closest("li").dataset.index;
    const url =
      "/questions/reorder?question_id=" +
      this.questionId +
      "&order=" +
      newPosition +
      "&survey_id=" +
      event.target.closest("li").dataset.surveyId;
    //let elements = Array.from(container.children);

    fetch(url, { headers: { Accept: "text/vnd.turbo-stream.html" } })
      .then((response) => response.text())
      .then((html) => {
        container.innerHTML = html;
      });
  }

  // dragleave event
  // -----------------------------
  dragleave(event) {
    event.preventDefault();

    // Clear drop borders for all elements with the 'field-preview' class
    let elms = document.querySelectorAll(".field-preview");
    elms.forEach((elm) => {
      elm.style["border-top"] = "";
      elm.style["border-bottom"] = "";
    });
  }

  clearDropBorders() {
    let elms = document.querySelectorAll(".field-preview");
    elms.forEach((elm) => {
      elm.style["border-top"] = "";
      elm.style["border-bottom"] = "";
    });
  }

  getIndexOfElm(elm) {
    let elms = document.querySelectorAll(".field-preview");
    let arr = Array.prototype.slice.call(elms);
    return arr.indexOf(elm);
  }
}
