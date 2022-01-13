class Screening::HrPolicy < Screening::BaseScreeningPolicy
  def index?
    user.admin? || user.hr? || user.team_lead?
  end
end
