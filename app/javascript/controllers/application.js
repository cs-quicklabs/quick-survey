import { Application } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

const application = Application.start()

// Configure Stimulus development experience
application.warnings = true
application.debug    = false
application.consumer = consumer
window.Stimulus      = application

export { application }
