class Screening::HrPolicy < Screening::BaseScreeningPolicy
  def index?
    user.hr?
  end


end
