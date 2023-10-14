import { application } from "./application";

import controllers from "./**/*_controller.js";

controllers.forEach((controller) => {
  application.register(controller.name, controller.module.default);
});

import StimulusSlimSelect from "./slim_select_controller";
application.register("slimselect", StimulusSlimSelect);

import Slideover from "./slideover_controller";
application.register("slideover", Slideover);

import Attempt from "./attempt_controller";
application.register("attempt", Attempt);

import DragItem from "./drag_item_controller";
application.register("drag-item", DragItem);

import HideElement from "./hide_element_controller";
application.register("hide-element", HideElement);