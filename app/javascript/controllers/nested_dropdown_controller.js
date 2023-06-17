import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ['menu', 'submenu', 'nestedmenu'];
  static values = { surveyId: Number, menuData: Array };

  connect() {
    this.menuTarget.classList.add('hidden');
    this.nestedmenuTargets.forEach((nestedMenu) => {
      nestedMenu.classList.add('hidden');
    });
    document.addEventListener('mouseover', (event) => {
      if (!event.target.closest('[data-action="mouseenter->nested-dropdown#toggleNestedMenu"]')) {
        this.nestedmenuTargets.forEach((nestedMenu) => {
          nestedMenu.classList.add('hidden');
        });
      }
    });
  }

  toggle() {
    this.menuTarget.classList.toggle('hidden');
    this.submenuTarget.classList.toggle('hidden');
  }

  async loadData(event) {
    try {
      this.surveyId = event.target.dataset.surveyId;
      const response = await fetch(`/space_folders?survey_id=${this.surveyId}`);
      const data = await response.json();
      this.menuDataValue = data;
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

  close() {
    this.submenuTarget.classList.add('hidden');
  }

  generateSubmenuItems(data) {
    let submenuItems = '';

    data.forEach((item, index) => {
      submenuItems += `
        <li class="cursor-pointer bg-white block truncate w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"  
        data-action="mouseenter->nested-dropdown#toggleNestedMenu "
          data-nested-dropdown-index="${item.id}"
        >
          <p class="inline-flex w-full">
            <span class="truncate block w-3/4">${item.title.charAt(0).toUpperCase() + item.title.slice(1)}</span>
            <span>
              <svg aria-hidden="true" class="w-4 h-4 mt-1 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            </span>
          </p>
      
          <ul class="absolute hidden  -mt-3 ml-36 z-10  w-36 origin-top-right bg-white rounded-lg shadow ring-black ring-opacity-5 focus:outline-none"
          data-nested-dropdown-target="nestedmenu" data-nested-dropdown-index="${item.id}">
        
          <!-- Nested menu items will be dynamically populated here -->
            ${this.generateNestedMenuItems(item.id)}
          
          </ul>
 
        </li>`;
    });
  
    return submenuItems;
  }

  toggleNestedMenu(event) {

    const index = event.currentTarget.dataset.nestedDropdownIndex;
    const nestedMenu=this.findNestedMenu(index);
    nestedMenu.classList.add("visible");
      event.stopPropagation();
  }
  closeNestedMenu(event) {
    this.nestedmenuTargets.forEach((menu) => {
      menu.style.display = 'none';
    }
    );
    event.stopPropagation();
  }

  
  findNestedMenu(index) {
    return this.nestedmenuTargets.find(nestedMenu => nestedMenu.dataset.nestedDropdownIndex === index.toString());
  }

generateNestedMenuItems(menuIndex) {
  const menuItem = this.menuDataValue.find(item => item.id.toString() === menuIndex.toString());
 
  let nestedMenuItems = '';


  menuItem.folders.forEach((child) => {
    nestedMenuItems += `<li class="cursor-pointer bg-white block truncate w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 ">
      <a href="/change_folder/${this.surveyId}/${child.id}">${child.title.toUpperCase().charAt(0) + child.title.slice(1)}</a>
    </li>`;
  });
console.log(nestedMenuItems);
  return nestedMenuItems;
}
}

