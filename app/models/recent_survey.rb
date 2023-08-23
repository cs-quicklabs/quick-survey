class RecentSurvey < ApplicationRecord
  belongs_to :user
  belongs_to :survey_surveys, class_name: "Survey::Survey"
end
