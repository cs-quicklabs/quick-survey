module ApplicationHelper
  include Pagy::Frontend
  include Extractor::HashTag
  include AutoLinkHelper

  def highlight_hashtag(title)
    hashtags = extract_hashtags(title)
    highlight(title, hashtags.map { |tag| "#" + tag })
  end

  def display_created_at(resource)
    display_date(resource.created_at)
  end

  def auto_link_urls_in_text(text)
    auto_link(text, html: { class: "text-indigo-700 hover:underline", target: "_blank" })
  end

  def display_date(date)
    date.to_date.to_formatted_s(:long)
  end

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
