class OpeningDecorator < Draper::Decorator
  delegate_all

  decorates_association :manager

  def display_name
    "#{first_name} #{last_name}".titleize
  end

  def display_job
    "#{job}".titleize
  end
end
