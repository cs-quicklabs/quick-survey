import { application } from "./application";

import controllers from "./**/*_controller.js";

controllers.forEach((controller) => {
  application.register(controller.name, controller.module.default);
});


import StimulusSlimSelect from "./slim_select_controller"
application.register('slimselect', StimulusSlimSelect)