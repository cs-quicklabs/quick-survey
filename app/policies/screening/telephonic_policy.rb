class Screening::TelephonicPolicy < Screening::BaseScreeningPolicy
  def index?
    user.admin? || user.telephonic_screener?
  end
end
