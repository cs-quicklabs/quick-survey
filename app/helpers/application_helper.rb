module ApplicationHelper
    include Pagy::Frontend
    def tailwind_form_with(**options, &block)
        form_with(**options.merge(builder: TailwindFormBuilder), &block)
      end
      def confirm_button(path, title, message, style)
        out = link_to title, path, class: style, data: {
                                     controller: "confirmation",
                                     "confirmation-message-value": message,
                                     action: "confirmation#confirm",
                                   }
                                  end
                                  def delete_button(path)
                                    out = link_to "Delete", path, class: "btn-inline-delete", data: {
                                                                    controller: "confirmation",
                                                                    "turbo-method": :delete,
                                                                    "confirmation-message-value": "Are you sure you want to delete this?",
                                                                    action: "confirmation#confirm",
                                                                  }
                                
                                    out.html_safe
                                  end

  def styled_delete_button(path, style)
    out = link_to "Delete", path, class: style, data: {
                                    controller: "confirmation",
                                    "turbo-method": :delete,
                                    "confirmation-message-value": "Are you sure you want to delete this?",
                                    action: "confirmation#confirm",
                                  }

    out.html_safe
  end
end
