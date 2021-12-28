module ApplicationHelper
    include Pagy::Frontend
    def tailwind_form_with(**options, &block)
        form_with(**options.merge(builder: TailwindFormBuilder), &block)
      end
    
end
