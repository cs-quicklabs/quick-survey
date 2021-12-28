class StageDecorator < Draper::Decorator
  delegate_all

  decorates_association :manager

  def display_stage
    name.titleize
  end
end
