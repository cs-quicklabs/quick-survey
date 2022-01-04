class Screening::HrPolicy < Screening::BaseScreeningPolicy
  def index?
    user.admin? || user.hr?
  end


end
