class CandidateDecorator < Draper::Decorator
  delegate_all

  decorates_association :manager

  def display_name
    "#{first_name} #{last_name}".titleize
  end

  def name
    display_name
  end

  def display_stage
    stage.name.titleize
  end

  def display_opening
    opening.job.titleize
  end
end
