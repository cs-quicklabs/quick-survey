class ActionView::Helpers::FormBuilder
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
end
