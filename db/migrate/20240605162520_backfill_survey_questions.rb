class BackfillSurveyQuestions < ActiveRecord::Migration[7.1]
  def change
    current_account = Account.find(1)
    ActsAsTenant.with_tenant(current_account) do
      Survey::Survey.all.each do |survey|
        survey.questions.each do |question|
          if question.options.first.nil?
            if survey.survey_type == "checklist"
              Survey::Option.new(text: "Yes", question: question, correct: true, weight: 1).save
            elsif survey.survey_type == "score"
              Survey::Option.new(text: "Score", question: question, correct: true, weight: 10).save
            else survey.survey_type == "yes_no"
              Survey::Option.new(text: "Yes", question: question, correct: true, weight: 1).save
              Survey::Option.new(text: "No", question: question, correct: false, weight: 0).save             end
          end
        end
      end
    end
  end
end
