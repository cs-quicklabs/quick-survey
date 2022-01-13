class Screening::TelephonicPolicy < Screening::BaseScreeningPolicy
  def index?
    user.admin? || user.telephonic_screener? || user.team_lead?
  end
end
