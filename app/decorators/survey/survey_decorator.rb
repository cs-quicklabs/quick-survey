class Survey::SurveyDecorator < Draper::Decorator
  delegate_all

  def survey_type_color
    if self.checklist?
      "yellow"
    elsif self.score?
      "gray"
    end
  end

  def survey_for_color
    if self.candidate?
      "gray"
    elsif self.user?
      "green"
    end
  end

  def display_survey_type
    survey_type.titleize
  end

  def display_survey_for
    if survey_for == "user"
      "Team"
    else
      survey_for.titleize
    end
  end

  def display_name
    name.upcase_first
  end
end
