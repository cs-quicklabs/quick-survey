class UserDecorator < Draper::Decorator
  delegate_all

  decorates_association :manager

  def display_name
    "#{first_name} #{last_name}".titleize
  end

  def display_name_position
    "#{first_name} #{last_name}".titleize + " (" + display_role_title + " " + display_job_title + ")".titleize
  end

  def name
    display_name
  end

  def display_job_title
    job.nil? ? "" : "#{job.name}"
  end

  def display_role_title
    role.nil? ? "" : "#{role.name}"
  end

  def display_discipline_title
    discipline.nil? ? "" : "#{discipline.name}"
  end

  def display_position
    display_role_title + " " + display_job_title
  end
end
