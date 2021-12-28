class TailwindFormBuilder < ActionView::Helpers::FormBuilder
  %w[rich_text_area].each do |method_name|
    define_method(method_name) do |name, title, *args|
      @template.content_tag :div do
        label(name, title, class: "block text-sm font-medium text-gray-700") +
        (@template.content_tag :div, class: "mt-1" do
          super(name, options.reverse_merge(class: "form-text-field"))
        end)
      end
    end
  end

  def flat_grouped_collection_select(field, collection, group_label_method, value_method, label_method, options = {}, html_options = {})
    hash = collection.group_by(&group_label_method).collect_hash do |group_label, group_entries|
      list_of_pairs = group_entries.collect { |entry|
        [entry.send(label_method), entry.send(value_method).to_s]
      }
      [group_label, list_of_pairs]
    end
    options_options = options.slice(:prompt)
    selected_key = object.send(field).to_s
    select(field, @template.grouped_options_for_select(hash, selected_key, options_options), options, html_options)
  end

  def text_field(method, title, opts = {})
    default_opts = { class: "form-text-field #{"border-red-400" if @object.errors.any?}" }
    merged_opts = default_opts.merge(opts)
    @template.content_tag :div do
      label(method, title, class: "block text-sm font-medium text-gray-700") +
      (@template.content_tag :div, class: "mt-1" do
        super(method, merged_opts)
      end)
    end
  end

  def text_area(method, title, opts = {})
    default_opts = { class: "form-text-field" }
    merged_opts = default_opts.merge(opts)
    @template.content_tag :div do
      label(method, title, class: "block text-sm font-medium text-gray-700") +
      (@template.content_tag :div, class: "mt-1" do
        super(method, merged_opts)
      end)
    end
  end

  def password_field(method, title, opts = {})
    default_opts = { class: "form-text-field #{"border-red-400" if @object.errors.any?}" }
    merged_opts = default_opts.merge(opts)
    @template.content_tag :div do
      label(method, title, class: "block text-sm font-medium text-gray-700") +
      (@template.content_tag :div, class: "mt-1" do
        super(method, merged_opts)
      end)
    end
  end
end
