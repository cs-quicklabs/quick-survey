class AddOrderToAllQuestions < ActiveRecord::Migration[7.0]
  def change
    ActsAsTenant.without_tenant do
      Survey::Survey.all.each do |survey|
        survey.questions.order(:created_at).each_with_index do |question, index|
          question.update(order: index + 1)
        end
      end
    end
  end
end
