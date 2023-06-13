

import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ['menu', 'submenu'];
  static values = { surveyId: Number };

  connect() { 
    this.menuTarget.classList.add('hidden');
  }

  toggle() {
    this.menuTarget.classList.toggle('hidden');
    this.submenuTarget.classList.toggle('hidden');
  }

  async loadData(event) {
    

    try {
      this.surveyId=event.target.dataset.surveyId
      const response = await fetch(`/folders/`);
      const data = await response.json();
      // Generate the submenu items based on the retrieved data
      const submenuItems = this.generateSubmenuItems(data);

      // Update the submenu with the generated items
      this.submenuTarget.innerHTML = submenuItems;

      // Show the submenu
      this.submenuTarget.classList.remove('hidden');
      
    } catch (error) {
      console.error(error);
    }
  }

  generateSubmenuItems(data) {
    let submenuItems = '';

    data.forEach((item) => {
      submenuItems += `<a href="/change_folder/${this.surveyId}/${item.id}"
       class="cursor-pointer bg-white block truncate w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 ">${item.title.charAt(0).toUpperCase() + item.title.slice(1)}</a>`;
    });

    return submenuItems;
  }
}

