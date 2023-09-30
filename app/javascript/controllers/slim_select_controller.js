import { Controller } from "@hotwired/stimulus";
import SlimSelect from "slim-select";

export default class extends Controller {
  static values = {
    options: Object,
  };

  connect() {
    this.slimselect = new SlimSelect({
      select: this.element,
      settings: {
        placeholderText: "Select People",
        maxValuesShown: 20, // Default 20
        maxValuesMessage: "{number} people selected", // Default '{number} selected'
      },
      ...this.optionsValue,
    });
  }
  disconnect() {
    this.slimselect.destroy();
  }
}
