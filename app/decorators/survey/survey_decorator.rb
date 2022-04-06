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

  def survey_type_color
    if self.survey_type?
      "green"
    else
      "indigo"
    end
  end

  def display_survey_type
    if self.survey_type?
      "Score"
    else
      "Checklist"
    end
  end
  def survey_stage_color
    if self.survey_stage==0
      "indigo"
    elsif self.survey_stage==1
      "gray"
    elsif self.survey_stage==2
      "green"
    elsif self.survey_stage==3
      "red"
    elsif self.survey_stage==4
      "purple"
    else
      ""
    end
  end
  def display_survey_stage
    if self.survey_stage==0
      "Resume"
    elsif self.survey_stage==1
      "Telephonic Interview"
    elsif self.survey_stage==2
      "Interview 1"
    elsif self.survey_stage==3
      "Interview 2"
    elsif self.survey_stage==4
      "HR Interview"
    else
      ""
    end
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
